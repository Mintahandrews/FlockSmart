import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, fallbackStorage, checkSupabaseConnection } from '../lib/supabase';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

type UserRole = 'seeker' | 'provider';

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  profile?: {
    university?: string;
    major?: string;
    graduationYear?: string;
    bio?: string;
    skills?: string[];
  };
}

interface AuthContextType {
  user: CustomUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<CustomUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      try {
        const isSupabaseConnected = await checkSupabaseConnection();
        setUsingLocalStorage(!isSupabaseConnected);
        
        if (isSupabaseConnected) {
          // Get initial session from Supabase
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          
          if (data.session) {
            await fetchUserProfile(data.session.user.id);
          }
          
          // Listen for auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              setSession(newSession);
              if (newSession) {
                await fetchUserProfile(newSession.user.id);
              } else {
                setUser(null);
              }
            }
          );
          
          return () => subscription.unsubscribe();
        } else {
          // Fallback to localStorage when Supabase is not connected
          const storedUserData = localStorage.getItem('user');
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              if (userData.user) {
                setUser(userData.user);
              }
            } catch (error) {
              console.error('Failed to parse user data from localStorage', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fall back to localStorage
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            if (userData.user) {
              setUser(userData.user);
            }
          } catch (error) {
            console.error('Failed to parse user data from localStorage', error);
          }
        }
        setUsingLocalStorage(true);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to get user from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If there's an error with Supabase, try localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const localUser = users.find((u: any) => u.id === userId);
        
        if (localUser) {
          const customUser: CustomUser = {
            id: localUser.id,
            email: localUser.email,
            name: localUser.name,
            role: localUser.role,
            isVerified: localUser.is_verified || localUser.isVerified,
            profile: localUser.profile
          };
          setUser(customUser);
          return;
        }
        
        throw error;
      }

      if (data) {
        const customUser: CustomUser = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
          isVerified: data.is_verified,
          profile: data.profile
        };
        setUser(customUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (!usingLocalStorage) {
        // Use Supabase auth
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          throw error;
        }
      } else {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => 
          u.email === email && u.password === password
        );
        
        if (!foundUser) {
          throw new Error('Invalid login credentials');
        }
        
        const userToStore: CustomUser = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          isVerified: foundUser.is_verified || foundUser.isVerified,
          profile: foundUser.profile
        };
        
        setUser(userToStore);
        localStorage.setItem('user', JSON.stringify({ user: userToStore }));
        toast.success(`Welcome back, ${userToStore.name}!`);
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Login error:', authError);
      throw new Error(authError.message || 'Failed to login');
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      if (!usingLocalStorage) {
        // 1. Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              name,
              role
            }
          }
        });
        
        if (authError) {
          throw authError;
        }

        if (!authData.user) {
          throw new Error('User creation failed');
        }

        // 2. Add user to our users table in Supabase
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email,
            name,
            role,
            is_verified: false,
            profile: {}
          }
        ]);

        if (profileError) {
          throw profileError;
        }
      } else {
        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find((u: any) => u.email === email);
        
        if (existingUser) {
          throw new Error('Email is already in use');
        }
        
        const newUser = {
          id: `user_${uuidv4()}`,
          email,
          password, // Warning: Storing password in localStorage is insecure
          name,
          role,
          is_verified: false,
          isVerified: false, // Include both formats for compatibility
          profile: {}
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login the new user
        const userToStore: CustomUser = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isVerified: newUser.is_verified,
          profile: newUser.profile
        };
        
        setUser(userToStore);
        localStorage.setItem('user', JSON.stringify({ user: userToStore }));
        toast.success('Account created successfully!');
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Registration error:', authError);
      throw new Error(authError.message || 'Failed to create an account');
    }
  };

  const logout = async () => {
    try {
      if (!usingLocalStorage) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      }
      
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const updateUser = async (userData: Partial<CustomUser>) => {
    if (!user) return;

    try {
      if (!usingLocalStorage) {
        // Update profile in Supabase users table
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name || user.name,
            role: userData.role || user.role,
            is_verified: userData.isVerified !== undefined ? userData.isVerified : user.isVerified,
            profile: userData.profile || user.profile
          })
          .eq('id', user.id);

        if (error) {
          throw error;
        }
      } else {
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.id === user.id) {
            return {
              ...u,
              name: userData.name || user.name,
              role: userData.role || user.role,
              is_verified: userData.isVerified !== undefined ? userData.isVerified : user.isVerified,
              isVerified: userData.isVerified !== undefined ? userData.isVerified : user.isVerified,
              profile: userData.profile || user.profile
            };
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update the current user in storage
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify({ user: updatedUser }));
        setUser(updatedUser);
      }

      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

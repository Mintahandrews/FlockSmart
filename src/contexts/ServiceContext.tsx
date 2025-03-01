import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, ServiceFilters, ServiceComplexity, ServiceStatus } from '../types/services';
import { useAuth } from './AuthContext';
import { supabase, fallbackStorage } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ServiceContextType {
  services: Service[];
  filteredServices: Service[];
  filters: ServiceFilters;
  createService: (serviceData: Omit<Service, 'id' | 'createdAt' | 'creatorName' | 'creatorId'>) => Promise<Service>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Promise<Service | undefined>;
  setFilter: <K extends keyof ServiceFilters>(key: K, value: ServiceFilters[K]) => void;
  resetFilters: () => void;
  myServices: Service[];
}

const defaultFilters: ServiceFilters = {
  query: '',
  subjectArea: '',
  minPrice: null,
  maxPrice: null,
  complexity: '',
  status: '',
  sortBy: 'latest'
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

interface ServiceProviderProps {
  children: ReactNode;
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filters, setFilters] = useState<ServiceFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  // Fetch services from storage
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Try to get from localStorage first
        const localServices = localStorage.getItem('services');
        if (localServices) {
          setServices(JSON.parse(localServices));
          setUsingLocalStorage(true);
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try Supabase
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            creator:creator_id(name)
          `);

        if (error) throw error;
        
        if (data) {
          // Transform data to match our Service type
          const transformedServices: Service[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            subjectArea: item.subject_area,
            deadline: item.deadline,
            budget: item.budget,
            complexity: item.complexity as ServiceComplexity,
            status: item.status as ServiceStatus,
            createdAt: item.created_at,
            creatorId: item.creator_id,
            creatorName: item.creator?.name || 'Unknown User'
          }));
          
          setServices(transformedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        
        // Fallback to localStorage
        const localServices = localStorage.getItem('services');
        if (localServices) {
          setServices(JSON.parse(localServices));
        }
        
        setUsingLocalStorage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'creatorName' | 'creatorId'>): Promise<Service> => {
    if (!user) throw new Error('You must be logged in to create a service');

    try {
      if (!usingLocalStorage) {
        // Use Supabase
        const { data, error } = await supabase
          .from('services')
          .insert([{
            title: serviceData.title,
            description: serviceData.description,
            subject_area: serviceData.subjectArea,
            deadline: serviceData.deadline,
            budget: serviceData.budget,
            complexity: serviceData.complexity,
            status: serviceData.status,
            creator_id: user.id
          }])
          .select()
          .single();

        if (error) throw error;
        
        if (!data) throw new Error('Failed to create service');
        
        const newService: Service = {
          id: data.id,
          title: data.title,
          description: data.description,
          subjectArea: data.subject_area,
          deadline: data.deadline,
          budget: data.budget,
          complexity: data.complexity as ServiceComplexity,
          status: data.status as ServiceStatus,
          createdAt: data.created_at,
          creatorId: data.creator_id,
          creatorName: user.name
        };

        setServices(prevServices => [...prevServices, newService]);
        return newService;
      } else {
        // Use localStorage
        const newService: Service = {
          id: `serv_${Date.now()}`,
          title: serviceData.title,
          description: serviceData.description,
          subjectArea: serviceData.subjectArea,
          deadline: serviceData.deadline,
          budget: serviceData.budget,
          complexity: serviceData.complexity,
          status: serviceData.status,
          createdAt: new Date().toISOString(),
          creatorId: user.id,
          creatorName: user.name
        };
        
        const updatedServices = [...services, newService];
        localStorage.setItem('services', JSON.stringify(updatedServices));
        setServices(updatedServices);
        
        return newService;
      }
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error('Failed to create service');
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>): Promise<Service> => {
    try {
      const existingService = services.find(s => s.id === id);
      if (!existingService) throw new Error('Service not found');
      
      if (!usingLocalStorage) {
        // Use Supabase
        const { data, error } = await supabase
          .from('services')
          .update({
            title: serviceData.title,
            description: serviceData.description,
            subject_area: serviceData.subjectArea,
            deadline: serviceData.deadline,
            budget: serviceData.budget,
            complexity: serviceData.complexity,
            status: serviceData.status
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        
        if (!data) throw new Error('Service not found');
        
        const updatedService: Service = {
          id: data.id,
          title: data.title,
          description: data.description,
          subjectArea: data.subject_area,
          deadline: data.deadline,
          budget: data.budget,
          complexity: data.complexity as ServiceComplexity,
          status: data.status as ServiceStatus,
          createdAt: data.created_at,
          creatorId: data.creator_id,
          creatorName: existingService.creatorName // Keep existing creator name
        };
        
        setServices(prevServices => 
          prevServices.map(service => service.id === id ? updatedService : service)
        );
        
        return updatedService;
      } else {
        // Use localStorage
        const updatedService = { 
          ...existingService, 
          ...serviceData, 
          updatedAt: new Date().toISOString() 
        };
        
        const updatedServices = services.map(s => s.id === id ? updatedService : s);
        localStorage.setItem('services', JSON.stringify(updatedServices));
        setServices(updatedServices);
        
        return updatedService;
      }
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error('Failed to update service');
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    try {
      if (!usingLocalStorage) {
        // Use Supabase
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }
      
      // Update state and localStorage either way
      const filteredServices = services.filter(service => service.id !== id);
      setServices(filteredServices);
      localStorage.setItem('services', JSON.stringify(filteredServices));
      
    } catch (error) {
      console.error('Error deleting service:', error);
      throw new Error('Failed to delete service');
    }
  };

  const getServiceById = async (id: string): Promise<Service | undefined> => {
    // First try to find in local state
    const localService = services.find(service => service.id === id);
    if (localService) return localService;
    
    // If not found and using Supabase, try to fetch from there
    if (!usingLocalStorage) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            creator:creator_id(name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) return undefined;
        
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          subjectArea: data.subject_area,
          deadline: data.deadline,
          budget: data.budget,
          complexity: data.complexity as ServiceComplexity,
          status: data.status as ServiceStatus,
          createdAt: data.created_at,
          creatorId: data.creator_id,
          creatorName: data.creator?.name || 'Unknown User'
        };
      } catch (error) {
        console.error('Error fetching service:', error);
        return undefined;
      }
    }
    
    return undefined;
  };

  const setFilter = <K extends keyof ServiceFilters>(key: K, value: ServiceFilters[K]) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Apply filters and sorting
  const filteredServices = services.filter(service => {
    // Same filtering logic as before
    if (filters.query && !service.title.toLowerCase().includes(filters.query.toLowerCase()) && 
        !service.description.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    
    if (filters.subjectArea && service.subjectArea !== filters.subjectArea) {
      return false;
    }
    
    if (filters.minPrice !== null && service.budget < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== null && service.budget > filters.maxPrice) {
      return false;
    }
    
    if (filters.complexity && service.complexity !== filters.complexity) {
      return false;
    }
    
    if (filters.status && service.status !== filters.status) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low-high':
        return a.budget - b.budget;
      case 'price-high-low':
        return b.budget - a.budget;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Get current user's services
  const myServices = user ? services.filter(service => service.creatorId === user.id) : [];

  return (
    <ServiceContext.Provider value={{ 
      services, 
      filteredServices, 
      filters, 
      createService, 
      updateService, 
      deleteService, 
      getServiceById,
      setFilter,
      resetFilters,
      myServices
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

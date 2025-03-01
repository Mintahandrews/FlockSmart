import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Conversation, SharedFile } from '../types/messages';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  unreadCount: number;
  getConversation: (participantId: string) => Conversation;
  getMessages: (conversationId: string) => Message[];
  getUser: (userId: string) => any;
  sendMessage: (receiverId: string, content: string, files?: SharedFile[]) => void;
  markAsRead: (messageIds: string[]) => void;
  uploadFile: (file: File, conversationId: string) => Promise<SharedFile>;
  updateCollaborativeNotes: (conversationId: string, notes: string) => void;
  deleteMessage: (messageId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    const storedConversations = localStorage.getItem('conversations');
    
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Failed to parse messages from localStorage', error);
        setMessages([]);
      }
    }
    
    if (storedConversations) {
      try {
        setConversations(JSON.parse(storedConversations));
      } catch (error) {
        console.error('Failed to parse conversations from localStorage', error);
        setConversations([]);
      }
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  
  // Update conversations with last messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Find the latest message for each conversation
    const updatedConversations = conversations.map(conversation => {
      // Get all messages between these participants
      const participantIds = conversation.participants;
      const conversationMessages = messages.filter(message => 
        participantIds.includes(message.senderId) && 
        participantIds.includes(message.receiverId)
      );
      
      // Find the latest message
      const latestMessage = conversationMessages.length > 0 
        ? conversationMessages.reduce((latest, current) => 
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
          ) 
        : undefined;
      
      return {
        ...conversation,
        lastMessage: latestMessage,
        lastUpdated: latestMessage ? latestMessage.timestamp : conversation.lastUpdated
      };
    });
    
    setConversations(updatedConversations);
  }, [messages]);
  
  // Get unread message count for current user
  const unreadCount = user 
    ? messages.filter(m => m.receiverId === user.id && !m.read).length 
    : 0;
  
  const getUser = (userId: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find((u: any) => u.id === userId);
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  };
  
  const getConversation = (participantId: string) => {
    if (!user) throw new Error('User must be logged in');
    
    // Find existing conversation between current user and participant
    const existingConversation = conversations.find(c => 
      c.participants.includes(user.id) && c.participants.includes(participantId)
    );
    
    if (existingConversation) {
      return existingConversation;
    }
    
    // Create a new conversation if it doesn't exist
    const newConversation: Conversation = {
      id: `conv_${uuidv4()}`,
      participants: [user.id, participantId],
      lastUpdated: new Date().toISOString(),
      sharedNotes: '',
    };
    
    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };
  
  const getMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];
    
    return messages.filter(m => 
      conversation.participants.includes(m.senderId) && 
      conversation.participants.includes(m.receiverId)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  const sendMessage = (receiverId: string, content: string, files: SharedFile[] = []) => {
    if (!user) {
      toast.error('You must be logged in to send messages');
      throw new Error('User must be logged in');
    }
    
    const newMessage: Message = {
      id: `msg_${uuidv4()}`,
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      files,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update the conversation's last message
    const conversation = getConversation(receiverId);
    const updatedConversations = conversations.map(c => 
      c.id === conversation.id 
        ? { ...c, lastMessage: newMessage, lastUpdated: newMessage.timestamp } 
        : c
    );
    
    setConversations(updatedConversations);
    
    toast.success('Message sent');
  };
  
  const markAsRead = (messageIds: string[]) => {
    if (messageIds.length === 0) return;
    
    setMessages(prev => prev.map(message => 
      messageIds.includes(message.id) ? { ...message, read: true } : message
    ));
  };
  
  const uploadFile = async (file: File, conversationId: string): Promise<SharedFile> => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      throw new Error('User must be logged in');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const base64Data = e.target?.result as string;
          
          const sharedFile: SharedFile = {
            id: `file_${uuidv4()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64Data,
            uploadedBy: user.id,
            timestamp: new Date().toISOString(),
          };
          
          resolve(sharedFile);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        toast.error('Failed to read file');
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  const updateCollaborativeNotes = (conversationId: string, notes: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, sharedNotes: notes, lastUpdated: new Date().toISOString() } 
        : conv
    ));
  };
  
  const deleteMessage = (messageId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete messages');
      throw new Error('User must be logged in');
    }
    
    // Find message to check if current user is the sender
    const message = messages.find(m => m.id === messageId);
    if (!message) {
      toast.error('Message not found');
      return;
    }
    
    if (message.senderId !== user.id) {
      toast.error('You can only delete your own messages');
      return;
    }
    
    setMessages(prev => prev.filter(m => m.id !== messageId));
    toast.success('Message deleted');
  };
  
  return (
    <MessageContext.Provider value={{ 
      messages, 
      conversations, 
      unreadCount,
      getConversation, 
      getMessages, 
      getUser,
      sendMessage, 
      markAsRead,
      uploadFile,
      updateCollaborativeNotes,
      deleteMessage
    }}>
      {children}
    </MessageContext.Provider>
  );
};

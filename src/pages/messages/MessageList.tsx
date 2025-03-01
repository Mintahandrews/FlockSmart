import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../contexts/MessageContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';

const MessageList = () => {
  const { user } = useAuth();
  const { conversations, unreadCount } = useMessages();
  
  if (!user) return <div>Loading...</div>;
  
  // Filter conversations for the current user
  const userConversations = conversations
    .filter(c => c.participants.includes(user.id))
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  
  // Get all users from localStorage for display names
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  
  // Get name for a given user ID
  const getUserName = (userId: string) => {
    const user = users.find((u: any) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  // Get the other participant in a conversation
  const getOtherParticipant = (conversation: any) => {
    const otherParticipantId = conversation.participants.find((id: string) => id !== user.id);
    return otherParticipantId ? getUserName(otherParticipantId) : 'Unknown User';
  };
  
  // Get the other participant's ID
  const getOtherParticipantId = (conversation: any) => {
    return conversation.participants.find((id: string) => id !== user.id);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="mr-2" size={20} />
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        {userConversations.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="mx-auto text-gray-400 mb-3" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No conversations yet</h2>
            <p className="text-gray-500 mb-4">
              Start a conversation by visiting a user's profile or service page.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {userConversations.map(conversation => {
              const otherParticipantId = getOtherParticipantId(conversation);
              const hasUnread = conversation.lastMessage && 
                conversation.lastMessage.receiverId === user.id && 
                !conversation.lastMessage.read;
              
              return (
                <Link 
                  key={conversation.id} 
                  to={`/messages/${otherParticipantId}`}
                  className={`block p-4 hover:bg-gray-50 transition-colors ${hasUnread ? 'bg-indigo-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h2 className="text-lg font-medium text-gray-900 truncate">
                          {getOtherParticipant(conversation)}
                        </h2>
                        {hasUnread && (
                          <span className="ml-2 bg-indigo-600 w-2 h-2 rounded-full"></span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.lastMessage.senderId === user.id ? (
                            <span className="text-gray-400">You: </span>
                          ) : null}
                          {conversation.lastMessage.content || 
                           (conversation.lastMessage.files?.length ? 
                            `Shared ${conversation.lastMessage.files.length} file(s)` : '')}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {formatRelativeTime(conversation.lastUpdated)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;

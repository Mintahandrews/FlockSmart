import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../contexts/MessageContext';
import { ArrowLeft, Download, FileText, Pen, Send } from 'lucide-react';
import FileUploader from '../../components/messages/FileUploader';
import { SharedFile } from '../../types/messages';
import toast from 'react-hot-toast';

const Conversation = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    getConversation, 
    getMessages, 
    sendMessage, 
    markAsRead, 
    getUser,
    uploadFile 
  } = useMessages();
  
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  if (!user || !userId) {
    useEffect(() => {
      toast.error("You need to be logged in to view messages");
      navigate('/login');
    }, []);
    return <div>Redirecting...</div>;
  }
  
  let conversation;
  let messages: any[] = [];
  let otherUser;
  
  try {
    conversation = getConversation(userId);
    messages = getMessages(conversation.id);
    otherUser = getUser(userId);
  } catch (error) {
    console.error(error);
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">Something went wrong when loading the conversation.</p>
        <Link to="/messages" className="text-indigo-600 hover:text-indigo-800">
          Return to messages
        </Link>
      </div>
    );
  }
  
  // Mark messages as read when viewing conversation
  useEffect(() => {
    const unreadMessages = messages
      .filter(m => m.receiverId === user.id && !m.read)
      .map(m => m.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, user.id, markAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !userId) return;
    
    let uploadedFile: SharedFile | undefined;
    
    try {
      if (selectedFile) {
        setIsUploading(true);
        uploadedFile = await uploadFile(selectedFile, conversation.id);
      }
      
      sendMessage(
        userId, 
        messageText.trim(), 
        uploadedFile ? [uploadedFile] : undefined
      );
      
      setMessageText('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    return <FileText size={16} />;
  };
  
  // Handle file download
  const handleDownload = (file: SharedFile) => {
    if (!file || !file.data) {
      toast.error("File data is missing");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };
  
  // Group messages by date
  const groupedMessages: { [date: string]: any[] } = {};
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/messages" className="mr-3 text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-lg font-medium">{otherUser?.name || 'User'}</h2>
              <p className="text-xs text-gray-500">
                {otherUser?.profile?.university || 'University not specified'}
              </p>
            </div>
          </div>
          <Link 
            to={`/collaborate/${conversation.id}`}
            className="bg-indigo-100 text-indigo-600 py-1 px-3 rounded-md flex items-center text-sm"
          >
            <Pen size={14} className="mr-1" />
            Collaborate
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="text-center my-4">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                {dateMessages.map(message => (
                  <div key={message.id} className={`mb-4 flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.senderId === user.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'} rounded-lg px-4 py-2 shadow-sm`}>
                      {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                      
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2">
                          {message.files.map(file => (
                            <div 
                              key={file.id} 
                              className="flex items-center bg-opacity-10 bg-gray-100 p-2 rounded cursor-pointer hover:bg-opacity-20"
                              onClick={() => handleDownload(file)}
                            >
                              {getFileIcon(file.type)}
                              <div className="ml-2 flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${message.senderId === user.id ? 'text-indigo-100' : 'text-gray-700'}`}>
                                  {file.name}
                                </p>
                                <p className={`text-xs ${message.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Download size={16} className={message.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'} />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-right mt-1 text-xs ${message.senderId === user.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          {selectedFile && (
            <FileUploader 
              selectedFile={selectedFile}
              onFileSelected={setSelectedFile}
              onCancel={() => setSelectedFile(null)}
            />
          )}
          
          {!selectedFile && (
            <div className="flex items-center mb-2">
              <button 
                onClick={() => document.getElementById('file-input')?.click()}
                className="text-gray-500 hover:text-indigo-600"
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
                <FileText size={20} />
              </button>
            </div>
          )}
          
          <div className="flex items-center">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 resize-none border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isUploading || (!messageText.trim() && !selectedFile)}
              className={`bg-indigo-600 text-white p-2 rounded-r-lg ${
                isUploading || (!messageText.trim() && !selectedFile)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

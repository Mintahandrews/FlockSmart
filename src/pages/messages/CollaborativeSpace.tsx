import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../contexts/MessageContext';
import { ArrowLeft, MessageSquare, PanelLeft, PanelRight, Save } from 'lucide-react';
import EnhancedWhiteboard from '../../components/whiteboard/EnhancedWhiteboard';

const CollaborativeSpace = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { conversations, updateCollaborativeNotes } = useMessages();
  
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  
  if (!user || !conversationId) return <div>Loading...</div>;
  
  const conversation = conversations.find(c => c.id === conversationId);
  
  if (!conversation) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 mb-4">Conversation not found</p>
        <Link to="/messages" className="text-indigo-600 hover:text-indigo-800">
          Return to messages
        </Link>
      </div>
    );
  }
  
  // Get the other participant in this conversation
  const otherParticipantId = conversation.participants.find(id => id !== user.id);
  
  // Get user details from localStorage
  const getUser = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find((u: any) => u.id === userId);
  };
  
  const otherUser = otherParticipantId ? getUser(otherParticipantId) : null;
  
  // Initialize notes from conversation
  useEffect(() => {
    if (conversation && conversation.sharedNotes !== undefined) {
      setNotes(conversation.sharedNotes);
    }
  }, [conversation]);
  
  // Auto-save notes every 5 seconds if changed
  useEffect(() => {
    const savedNotes = conversation.sharedNotes || '';
    if (notes !== savedNotes) {
      const timer = setTimeout(() => {
        handleSaveNotes();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notes, conversation]);
  
  const handleSaveNotes = async () => {
    setIsSaving(true);
    
    try {
      updateCollaborativeNotes(conversationId, notes);
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setSaveMessage('Error saving');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleWhiteboardSave = (dataUrl: string) => {
    // Add the image URL to the notes
    const imageMarkdown = `\n\n![Whiteboard](${dataUrl})\n\n`;
    setNotes(prevNotes => prevNotes + imageMarkdown);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`/messages/${otherParticipantId}`} className="text-white mr-3">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">
            Collaborative Space with {otherUser?.name || 'User'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowWhiteboard(!showWhiteboard)} 
            className="bg-white text-indigo-600 py-1 px-3 rounded text-sm flex items-center"
          >
            {showWhiteboard ? <PanelRight size={14} className="mr-1" /> : <PanelLeft size={14} className="mr-1" />}
            {showWhiteboard ? 'Hide Whiteboard' : 'Show Whiteboard'}
          </button>
          <Link 
            to={`/messages/${otherParticipantId}`}
            className="bg-white text-indigo-600 py-1 px-3 rounded text-sm flex items-center"
          >
            <MessageSquare size={14} className="mr-1" />
            Messages
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          {showWhiteboard && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Interactive Whiteboard</h2>
                <div className="text-sm text-gray-500">
                  Collaborate in real-time
                </div>
              </div>
              <EnhancedWhiteboard 
                width={700} 
                height={400} 
                onSave={handleWhiteboardSave} 
                allowRecording={true}
              />
            </div>
          )}
          
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Shared Notes</h2>
              <div className="flex items-center">
                {saveMessage && (
                  <span className="text-green-600 text-sm mr-3">{saveMessage}</span>
                )}
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 flex items-center text-sm"
                >
                  <Save size={14} className="mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your collaborative notes here... Both you and your partner can edit this in real-time."
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="mt-4 text-sm text-gray-500">
              <p>
                <strong>Note:</strong> Changes are automatically saved every few seconds. Both participants can see and edit these notes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeSpace;

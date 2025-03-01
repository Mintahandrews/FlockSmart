import { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import { AppData } from '../types';

interface AIAssistantProps {
  data: AppData;
}

const AIAssistant = ({ data }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! I\'m your FlockSmart AI assistant. How can I help you manage your poultry farm today?'}
  ]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsMinimized(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {role: 'user', content: message}]);
    
    // Process the query
    const response = generateAIResponse(message, data);
    
    // Add AI response after a small delay to simulate processing
    setTimeout(() => {
      setConversation(prev => [...prev, {role: 'assistant', content: response}]);
    }, 600);
    
    // Clear input
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* AI Assistant button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* AI Assistant panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 z-50 ${
            isMinimized ? 'h-14' : 'h-96 max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200">
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium">FlockSmart AI</h3>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-500 hover:text-gray-700 mr-2 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Conversation area */}
              <div className="h-72 overflow-y-auto p-3 bg-gray-50">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input area */}
              <div className="p-3 border-t border-gray-200 flex">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ask about your flock..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-200"
                  onClick={handleSendMessage}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

// Generate AI responses based on the query and app data
function generateAIResponse(query: string, data: AppData): string {
  const queryLower = query.toLowerCase();
  
  // Feed related queries
  if (queryLower.includes('feed') || queryLower.includes('feeding')) {
    const totalFeedCost = data.feedRecords.reduce((sum, record) => 
      sum + (record.quantityKg * record.costPerKg), 0);
      
    // Get Layer and Broiler flocks
    const layerFlocks = data.flocks.filter(f => f.birdType === 'Layer');
    const broilerFlocks = data.flocks.filter(f => f.birdType === 'Broiler');
    
    let response = `Based on your records, you've spent ${totalFeedCost.toFixed(2)} GHS on feed. `;
    
    if (layerFlocks.length > 0) {
      response += `Your Layer flocks should be fed with high-calcium feed for optimal egg production. `;
    }
    
    if (broilerFlocks.length > 0) {
      response += `Broilers need high-protein feed for better growth rates. `;
    }
    
    return response;
  }
  
  // Egg production queries
  if (queryLower.includes('egg') || queryLower.includes('production')) {
    const latestRecord = data.eggProduction.length > 0 ? data.eggProduction[0] : null;
    const totalLayers = data.flocks
      .filter(f => f.birdType === 'Layer')
      .reduce((sum, f) => sum + f.count, 0);
    
    if (latestRecord && totalLayers > 0) {
      const rate = ((latestRecord.quantity / totalLayers) * 100).toFixed(1);
      return `Your current egg production rate is approximately ${rate}%. For optimal production, ensure your layers have 16 hours of light daily and consistent access to clean water. Consider calcium supplements if shell quality is declining.`;
    }
    return "I don't see any egg production records yet. Start tracking to get insights on your production efficiency.";
  }
  
  // Health related queries
  if (queryLower.includes('health') || queryLower.includes('disease') || queryLower.includes('sick')) {
    const poorHealthFlocks = data.flocks.filter(f => f.healthStatus === 'Poor' || f.healthStatus === 'Fair');
    
    if (poorHealthFlocks.length > 0) {
      return `I noticed ${poorHealthFlocks.length} flocks with health concerns. For ${poorHealthFlocks[0].name}, check ventilation and water quality. Separate sick birds and consider consulting a veterinarian.`;
    }
    return "Your flocks appear to be in good health. Continue monitoring for any signs of disease such as reduced feed intake, unusual droppings, or respiratory issues.";
  }
  
  // Financial queries
  if (queryLower.includes('profit') || queryLower.includes('finances') || queryLower.includes('money')) {
    const revenue = data.salesRecords.reduce((sum, record) => sum + (record.quantity * record.unitPrice), 0);
    const expenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = revenue - expenses;
    
    return `Your total revenue is ${revenue.toFixed(2)} GHS and expenses are ${expenses.toFixed(2)} GHS, giving a ${profit >= 0 ? 'profit' : 'loss'} of ${Math.abs(profit).toFixed(2)} GHS. ${profit < 0 ? 'Consider reducing expenses or increasing production to improve profitability.' : 'Great job managing your farm finances!'}`;
  }
  
  // General queries or unknown
  return "I can help with feed management, health monitoring, production tracking, and financial analysis. Could you provide more details about what you'd like to know?";
}

export default AIAssistant;

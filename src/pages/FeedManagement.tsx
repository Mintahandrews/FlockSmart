import { useState } from 'react';
import { AppData, FeedRecord } from '../types';
import { getRecommendedFeed } from '../utils/feedRecommendations';
import { ChartBar, CirclePlus } from 'lucide-react';
import { formatDate, formatCurrency, generateId } from '../utils';
import AIInsights from '../components/AIInsights';

interface FeedManagementProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const FeedManagement = ({ data, setData }: FeedManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeedRecord, setNewFeedRecord] = useState<Partial<FeedRecord>>({
    flockId: data.flocks.length > 0 ? data.flocks[0].id : '',
    feedType: '',
    quantityKg: 0,
    costPerKg: 0
  });

  const handleAddFeedRecord = () => {
    if (!newFeedRecord.flockId || !newFeedRecord.feedType || !newFeedRecord.quantityKg) {
      alert('Please fill all required fields');
      return;
    }

    const selectedFlock = data.flocks.find(flock => flock.id === newFeedRecord.flockId);
    
    const feedRecord: FeedRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      flockId: newFeedRecord.flockId,
      flockName: selectedFlock ? selectedFlock.name : 'Unknown Flock',
      feedType: newFeedRecord.feedType,
      quantityKg: newFeedRecord.quantityKg || 0,
      costPerKg: newFeedRecord.costPerKg || 0
    };

    setData(prev => ({
      ...prev,
      feedRecords: [feedRecord, ...prev.feedRecords]
    }));

    // Reset form
    setNewFeedRecord({
      flockId: newFeedRecord.flockId,
      feedType: '',
      quantityKg: 0,
      costPerKg: 0
    });
    setShowAddForm(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Feed Management</h1>
      
      <AIInsights data={data} type="feed" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">Feed Consumption Records</h2>
              <button 
                className="flex items-center text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => setShowAddForm(true)}
              >
                <CirclePlus className="h-4 w-4 mr-1" />
                Add Record
              </button>
            </div>

            {showAddForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">New Feed Record</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flock</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newFeedRecord.flockId}
                      onChange={(e) => setNewFeedRecord(prev => ({ ...prev, flockId: e.target.value }))}
                    >
                      {data.flocks.map(flock => (
                        <option key={flock.id} value={flock.id}>{flock.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type</label>
                    <input 
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newFeedRecord.feedType}
                      onChange={(e) => setNewFeedRecord(prev => ({ ...prev, feedType: e.target.value }))}
                      placeholder="e.g. Layer Pellets"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
                    <input 
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newFeedRecord.quantityKg || ''}
                      onChange={(e) => setNewFeedRecord(prev => ({ ...prev, quantityKg: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost per kg (GHS)</label>
                    <input 
                      type="number"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newFeedRecord.costPerKg || ''}
                      onChange={(e) => setNewFeedRecord(prev => ({ ...prev, costPerKg: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                    onClick={handleAddFeedRecord}
                  >
                    Save Record
                  </button>
                  <button 
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-300"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Flock</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Feed Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.feedRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-2">{formatDate(record.date)}</td>
                      <td className="px-4 py-2">{record.flockName}</td>
                      <td className="px-4 py-2">{record.feedType}</td>
                      <td className="px-4 py-2">{record.quantityKg} kg</td>
                      <td className="px-4 py-2">{formatCurrency(record.quantityKg * record.costPerKg)}</td>
                    </tr>
                  ))}
                  {data.feedRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                        No feed records found. Add your first record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center mb-4">
              <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="text-lg font-semibold">AI Feed Recommendations</h2>
            </div>
            
            <div className="space-y-4">
              {data.flocks.map(flock => (
                <div key={flock.id} className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm">{flock.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{flock.birdType} • {flock.ageWeeks} weeks • Avg {flock.avgWeight}kg</p>
                  <p className="text-sm">{getRecommendedFeed(flock.birdType, flock.ageWeeks)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-medium mb-2 text-sm">Feed Cost Analysis</h3>
              <p className="text-sm text-gray-600">
                Total feed cost (last 30 days): 
                <span className="font-semibold ml-1">
                  {formatCurrency(
                    data.feedRecords
                      .filter(record => {
                        const recordDate = new Date(record.date);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return recordDate >= thirtyDaysAgo;
                      })
                      .reduce((sum, record) => sum + (record.quantityKg * record.costPerKg), 0)
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedManagement;

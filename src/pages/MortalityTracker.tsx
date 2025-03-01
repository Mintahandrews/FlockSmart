import { useState } from 'react';
import { AppData, MortalityRecord } from '../types';
import { formatDate, generateId } from '../utils';
import { CirclePlus, Skull } from 'lucide-react';

interface MortalityTrackerProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const MortalityTracker = ({ data, setData }: MortalityTrackerProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MortalityRecord>>({
    flockId: data.flocks.length > 0 ? data.flocks[0].id : '',
    count: 1,
    cause: '',
    notes: ''
  });

  const handleAddRecord = () => {
    if (!newRecord.flockId || !newRecord.count || !newRecord.cause) {
      alert('Please fill all required fields');
      return;
    }

    if (newRecord.count <= 0) {
      alert('Mortality count must be greater than zero');
      return;
    }

    const selectedFlock = data.flocks.find(flock => flock.id === newRecord.flockId);
    
    if (!selectedFlock) {
      alert('Selected flock not found');
      return;
    }

    if (newRecord.count > selectedFlock.count) {
      alert(`Mortality count cannot exceed current flock count (${selectedFlock.count})`);
      return;
    }

    // Confirm with user before recording mortality
    if (!window.confirm(`Are you sure you want to record ${newRecord.count} mortality for ${selectedFlock.name}?`)) {
      return;
    }

    const mortalityRecord: MortalityRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      flockId: newRecord.flockId!,
      flockName: selectedFlock.name,
      count: newRecord.count || 0,
      cause: newRecord.cause || '',
      notes: newRecord.notes || ''
    };

    // Update the mortality records
    setData(prev => ({
      ...prev,
      mortalityRecords: [mortalityRecord, ...prev.mortalityRecords]
    }));

    // Update the flock count
    setData(prev => ({
      ...prev,
      flocks: prev.flocks.map(flock => 
        flock.id === newRecord.flockId 
          ? { ...flock, count: flock.count - (newRecord.count || 0), lastUpdated: new Date().toISOString() } 
          : flock
      )
    }));

    // Create a health alert if mortality is high
    if ((newRecord.count || 0) > 1) {
      const newAlert = {
        id: generateId(),
        date: new Date().toISOString(),
        flockId: newRecord.flockId!,
        flockName: selectedFlock.name,
        severity: 'Medium' as const,
        message: `Mortality event: ${newRecord.count} birds lost due to ${newRecord.cause}. Check flock conditions.`,
        isRead: false
      };
      
      setData(prev => ({
        ...prev,
        healthAlerts: [newAlert, ...prev.healthAlerts]
      }));
    }

    // Reset form
    setNewRecord({
      flockId: newRecord.flockId,
      count: 1,
      cause: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  // Calculate mortality statistics
  const calculateMortalityStats = () => {
    const totalBirds = data.flocks.reduce((sum, flock) => sum + flock.count, 0);
    const totalMortality = data.mortalityRecords.reduce((sum, record) => sum + record.count, 0);
    
    // Avoid division by zero
    const mortalityRate = totalBirds > 0 || totalMortality > 0
      ? ((totalMortality / (totalBirds + totalMortality)) * 100).toFixed(2) 
      : '0.00';
    
    return { totalMortality, mortalityRate };
  };

  const { totalMortality, mortalityRate } = calculateMortalityStats();

  // Get mortality by cause for analysis
  const mortalityByCause = data.mortalityRecords.reduce((acc, record) => {
    const cause = record.cause || 'Unknown';
    acc[cause] = (acc[cause] || 0) + record.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mortality Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-start">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <Skull className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Mortality Summary</h2>
              <p className="text-sm text-gray-500 mb-3">Current statistics</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Total Losses</p>
                  <p className="text-xl font-bold">{totalMortality} birds</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mortality Rate</p>
                  <p className="text-xl font-bold">{mortalityRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(mortalityByCause).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold mb-3">Mortality by Cause</h2>
            <div className="space-y-2">
              {Object.entries(mortalityByCause)
                .sort(([,a], [,b]) => b - a)
                .map(([cause, count]) => (
                  <div key={cause} className="relative pt-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">{cause}</span>
                      <span className="text-xs font-medium text-gray-700">{count} birds</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ 
                          width: `${(count / totalMortality) * 100}%` 
                        }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Mortality Records</h2>
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
            <h3 className="font-medium mb-3">New Mortality Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flock</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newRecord.flockId}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, flockId: e.target.value }))}
                >
                  {data.flocks.map(flock => (
                    <option key={flock.id} value={flock.id}>{flock.name} ({flock.count} birds)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Birds</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newRecord.count || ''}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newRecord.cause}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, cause: e.target.value }))}
                >
                  <option value="">Select a cause</option>
                  <option value="Disease">Disease</option>
                  <option value="Injury">Injury</option>
                  <option value="Predator">Predator</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Age">Age</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  value={newRecord.notes || ''}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional details about this mortality event..."
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                onClick={handleAddRecord}
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
                <th className="px-4 py-2 text-left font-medium text-gray-500">Count</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Cause</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.mortalityRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2">{formatDate(record.date)}</td>
                  <td className="px-4 py-2">{record.flockName}</td>
                  <td className="px-4 py-2">{record.count}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${record.cause === 'Disease' ? 'bg-red-100 text-red-800' : 
                        record.cause === 'Injury' ? 'bg-yellow-100 text-yellow-800' :
                        record.cause === 'Predator' ? 'bg-orange-100 text-orange-800' :
                        record.cause === 'Environmental' ? 'bg-blue-100 text-blue-800' :
                        record.cause === 'Age' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {record.cause}
                    </span>
                  </td>
                  <td className="px-4 py-2">{record.notes}</td>
                </tr>
              ))}
              {data.mortalityRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No mortality records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MortalityTracker;

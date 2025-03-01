import { useState } from 'react';
import { AppData, HealthAlert } from '../types';
import { getHealthAssessment } from '../utils/healthAssessment';
import { Activity, CircleAlert } from 'lucide-react';
import { generateId } from '../utils';

interface FlockHealthProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const FlockHealth = ({ data, setData }: FlockHealthProps) => {
  const [selectedFlockId, setSelectedFlockId] = useState<string | null>(
    data.flocks.length > 0 ? data.flocks[0].id : null
  );

  const selectedFlock = data.flocks.find(flock => flock.id === selectedFlockId);
  
  const updateFlockHealth = (flockId: string, status: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    setData(prev => ({
      ...prev,
      flocks: prev.flocks.map(flock => 
        flock.id === flockId 
          ? { ...flock, healthStatus: status, lastUpdated: new Date().toISOString() } 
          : flock
      )
    }));

    // Create a health alert if health status is Fair or Poor
    if (status === 'Fair' || status === 'Poor') {
      const flock = data.flocks.find(f => f.id === flockId);
      if (flock) {
        const newAlert: HealthAlert = {
          id: generateId(),
          date: new Date().toISOString(),
          flockId: flockId,
          flockName: flock.name,
          severity: status === 'Fair' ? 'Medium' : 'High',
          message: status === 'Fair' 
            ? 'Health status decreased to Fair. Consider preventative measures.' 
            : 'Health status decreased to Poor. Immediate attention required.',
          isRead: false
        };
        
        setData(prev => ({
          ...prev,
          healthAlerts: [newAlert, ...prev.healthAlerts]
        }));
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Flock Health Monitoring</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Your Flocks</h2>
            <div className="space-y-2">
              {data.flocks.map(flock => (
                <div 
                  key={flock.id}
                  className={`p-3 rounded-lg cursor-pointer transition
                    ${selectedFlockId === flock.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                  onClick={() => setSelectedFlockId(flock.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{flock.name}</h3>
                      <p className="text-sm text-gray-500">{flock.count} birds • {flock.birdType}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${flock.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        flock.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                        flock.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {flock.healthStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedFlock ? (
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{selectedFlock.name}</h2>
                  <p className="text-sm text-gray-500">{selectedFlock.birdType} • {selectedFlock.ageWeeks} weeks old</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${selectedFlock.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 
                    selectedFlock.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                    selectedFlock.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {selectedFlock.healthStatus}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  AI Health Assessment
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  {getHealthAssessment(selectedFlock)}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3">Update Health Status</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Excellent', 'Good', 'Fair', 'Poor'] as const).map(status => (
                    <button
                      key={status}
                      className={`py-2 px-4 rounded-lg border text-sm font-medium transition
                        ${selectedFlock.healthStatus === status
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => updateFlockHealth(selectedFlock.id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  rows={3}
                  value={selectedFlock.notes}
                  onChange={(e) => {
                    setData(prev => ({
                      ...prev,
                      flocks: prev.flocks.map(flock => 
                        flock.id === selectedFlock.id 
                          ? { ...flock, notes: e.target.value } 
                          : flock
                      )
                    }));
                  }}
                  placeholder="Add notes about this flock..."
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center">
              <CircleAlert className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-500">No Flock Selected</h3>
              <p className="text-gray-400">Select a flock to view health details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlockHealth;

import { useState } from 'react';
import { AppData, FlockGroup } from '../types';
import { generateId, formatDate } from '../utils';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface FlockManagementProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const FlockManagement = ({ data, setData }: FlockManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingFlockId, setEditingFlockId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<FlockGroup, 'id' | 'lastUpdated'>>({
    name: '',
    birdType: 'Layer',
    count: 0,
    ageWeeks: 0,
    avgWeight: 0,
    healthStatus: 'Good',
    notes: ''
  });

  const handleAddOrUpdateFlock = () => {
    if (!formData.name || formData.count <= 0) {
      alert('Please fill in required fields (name and count)');
      return;
    }

    if (editingFlockId) {
      // Update existing flock
      setData(prev => ({
        ...prev,
        flocks: prev.flocks.map(flock => 
          flock.id === editingFlockId 
            ? { 
                ...flock, 
                ...formData,
                lastUpdated: new Date().toISOString() 
              } 
            : flock
        )
      }));
    } else {
      // Add new flock
      const newFlock: FlockGroup = {
        id: generateId(),
        lastUpdated: new Date().toISOString(),
        ...formData
      };

      setData(prev => ({
        ...prev,
        flocks: [...prev.flocks, newFlock]
      }));
    }

    // Reset form
    setFormData({
      name: '',
      birdType: 'Layer',
      count: 0,
      ageWeeks: 0,
      avgWeight: 0,
      healthStatus: 'Good',
      notes: ''
    });
    setShowForm(false);
    setEditingFlockId(null);
  };

  const handleEditFlock = (flock: FlockGroup) => {
    setFormData({
      name: flock.name,
      birdType: flock.birdType,
      count: flock.count,
      ageWeeks: flock.ageWeeks,
      avgWeight: flock.avgWeight,
      healthStatus: flock.healthStatus,
      notes: flock.notes
    });
    setEditingFlockId(flock.id);
    setShowForm(true);
  };

  const handleDeleteFlock = (flockId: string) => {
    if (window.confirm('Are you sure you want to delete this flock? This will also remove related records.')) {
      setData(prev => ({
        ...prev,
        flocks: prev.flocks.filter(flock => flock.id !== flockId),
        // Also filter out related records
        feedRecords: prev.feedRecords.filter(record => record.flockId !== flockId),
        eggProduction: prev.eggProduction.filter(record => record.flockId !== flockId),
        healthAlerts: prev.healthAlerts.filter(alert => alert.flockId !== flockId),
        vaccinationRecords: prev.vaccinationRecords.filter(record => record.flockId !== flockId),
        scheduledVaccinations: prev.scheduledVaccinations.filter(vax => vax.flockId !== flockId),
        mortalityRecords: prev.mortalityRecords.filter(record => record.flockId !== flockId)
      }));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Flock Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Manage all your flocks in one place</p>
        <button 
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-1" />
          Add New Flock
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingFlockId ? 'Edit Flock' : 'Add New Flock'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flock Name*</label>
              <input 
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Layer Hens A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bird Type</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.birdType}
                onChange={(e) => setFormData(prev => ({ ...prev, birdType: e.target.value as 'Layer' | 'Broiler' | 'Dual Purpose' }))}
              >
                <option value="Layer">Layer</option>
                <option value="Broiler">Broiler</option>
                <option value="Dual Purpose">Dual Purpose</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bird Count*</label>
              <input 
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.count || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age (weeks)</label>
              <input 
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.ageWeeks || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ageWeeks: parseInt(e.target.value) }))}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Average Weight (kg)</label>
              <input 
                type="number"
                step="0.1"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.avgWeight || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, avgWeight: parseFloat(e.target.value) }))}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.healthStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value as 'Excellent' | 'Good' | 'Fair' | 'Poor' }))}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional information about this flock..."
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleAddOrUpdateFlock}
            >
              {editingFlockId ? 'Update Flock' : 'Add Flock'}
            </button>
            <button 
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              onClick={() => {
                setShowForm(false);
                setEditingFlockId(null);
                setFormData({
                  name: '',
                  birdType: 'Layer',
                  count: 0,
                  ageWeeks: 0,
                  avgWeight: 0,
                  healthStatus: 'Good',
                  notes: ''
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Flock Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Count</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Age (weeks)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Health</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Last Updated</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.flocks.map((flock) => (
                <tr key={flock.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{flock.name}</td>
                  <td className="px-4 py-3">{flock.birdType}</td>
                  <td className="px-4 py-3">{flock.count}</td>
                  <td className="px-4 py-3">{flock.ageWeeks}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${flock.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        flock.healthStatus === 'Good' ? 'bg-blue-100 text-blue-800' :
                        flock.healthStatus === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {flock.healthStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatDate(flock.lastUpdated)}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-blue-600 hover:text-blue-800" 
                        onClick={() => handleEditFlock(flock)}
                        title="Edit flock"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800" 
                        onClick={() => handleDeleteFlock(flock.id)}
                        title="Delete flock"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.flocks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No flocks added yet. Click "Add New Flock" to get started.
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

export default FlockManagement;

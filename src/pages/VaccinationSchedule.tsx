import { useState } from 'react';
import { AppData, ScheduledVaccination, VaccinationRecord } from '../types';
import { formatDate, generateId } from '../utils';
import { Squircle, Calendar, CalendarPlus, CircleCheck, Clock } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface VaccinationScheduleProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const VaccinationSchedule = ({ data, setData }: VaccinationScheduleProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVaccination, setNewVaccination] = useState<Partial<ScheduledVaccination>>({
    flockId: data.flocks.length > 0 ? data.flocks[0].id : '',
    treatment: '',
    treatmentType: 'Vaccine',
    notes: '',
    scheduledDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    completed: false
  });

  const handleAddSchedule = () => {
    if (!newVaccination.flockId || !newVaccination.treatment || !newVaccination.scheduledDate) {
      alert('Please fill all required fields');
      return;
    }

    // Validate date
    const scheduledDate = new Date(newVaccination.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      alert('Please enter a valid date');
      return;
    }

    const selectedFlock = data.flocks.find(flock => flock.id === newVaccination.flockId);
    
    const scheduledVax: ScheduledVaccination = {
      id: generateId(),
      scheduledDate: scheduledDate.toISOString(),
      flockId: newVaccination.flockId!,
      flockName: selectedFlock ? selectedFlock.name : 'Unknown Flock',
      treatment: newVaccination.treatment!,
      treatmentType: newVaccination.treatmentType as 'Vaccine' | 'Medication' | 'Supplement',
      notes: newVaccination.notes || '',
      completed: false
    };

    setData(prev => ({
      ...prev,
      scheduledVaccinations: [...prev.scheduledVaccinations, scheduledVax]
    }));

    // Reset form
    setNewVaccination({
      flockId: newVaccination.flockId,
      treatment: '',
      treatmentType: 'Vaccine',
      notes: '',
      scheduledDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      completed: false
    });
    setShowAddForm(false);
  };

  const markAsCompleted = (id: string) => {
    // Find the scheduled vaccination
    const scheduledVax = data.scheduledVaccinations.find(vax => vax.id === id);
    
    if (!scheduledVax) return;
    
    // Create a vaccination record
    const vaccinationRecord: VaccinationRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      flockId: scheduledVax.flockId,
      flockName: scheduledVax.flockName,
      type: scheduledVax.treatmentType === 'Vaccine' ? 'Vaccination' : 'Medication',
      name: scheduledVax.treatment,
      notes: `${scheduledVax.notes} (Completed as scheduled)`,
      completed: true,
      nextDueDate: null
    };
    
    // Update data
    setData(prev => ({
      ...prev,
      vaccinationRecords: [vaccinationRecord, ...prev.vaccinationRecords],
      scheduledVaccinations: prev.scheduledVaccinations.map(vax => 
        vax.id === id ? { ...vax, completed: true } : vax
      )
    }));
  };

  // Group vaccinations by status
  const today = new Date();
  
  const upcomingVaccinations = data.scheduledVaccinations
    .filter(vax => !vax.completed && isAfter(new Date(vax.scheduledDate), today))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    
  const dueVaccinations = data.scheduledVaccinations
    .filter(vax => !vax.completed && isBefore(new Date(vax.scheduledDate), today));
    
  const completedVaccinations = data.vaccinationRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vaccination & Treatment Schedule</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Due Vaccinations */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-red-50 p-2 rounded-full mr-3">
              <Squircle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold">Due Now ({dueVaccinations.length})</h2>
          </div>
          
          {dueVaccinations.length > 0 ? (
            <div className="space-y-3">
              {dueVaccinations.map(vax => {
                const daysOverdue = Math.floor((today.getTime() - new Date(vax.scheduledDate).getTime()) / (1000 * 3600 * 24));
                
                return (
                  <div key={vax.id} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{vax.treatment}</h3>
                        <p className="text-sm text-gray-500">For: {vax.flockName}</p>
                        <p className="text-xs mt-1">
                          <span className="text-red-600 font-medium">
                            {daysOverdue === 0 ? 'Due today' : `Overdue by ${daysOverdue} days`}
                          </span>
                        </p>
                        {vax.notes && <p className="text-xs italic mt-1">{vax.notes}</p>}
                      </div>
                      <button
                        onClick={() => markAsCompleted(vax.id)}
                        className="flex items-center text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                      >
                        <CircleCheck className="h-3 w-3 mr-1" />
                        Mark Complete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-3">No treatments due</p>
          )}
        </div>
        
        {/* Upcoming Vaccinations */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-blue-50 p-2 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Upcoming ({upcomingVaccinations.length})</h2>
          </div>
          
          {upcomingVaccinations.length > 0 ? (
            <div className="space-y-3">
              {upcomingVaccinations.map(vax => {
                const daysUntil = Math.floor((new Date(vax.scheduledDate).getTime() - today.getTime()) / (1000 * 3600 * 24));
                
                return (
                  <div key={vax.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                    <h3 className="font-medium">{vax.treatment}</h3>
                    <p className="text-sm text-gray-500">For: {vax.flockName}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 text-blue-500" />
                      <p className="text-xs">
                        {daysUntil === 0 ? 'Due today' : 
                         daysUntil === 1 ? 'Due tomorrow' : 
                         `Due in ${daysUntil} days`} ({formatDate(vax.scheduledDate)})
                      </p>
                    </div>
                    {vax.notes && <p className="text-xs italic mt-1">{vax.notes}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-3">No upcoming treatments</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Schedule New Treatment</h2>
          <button 
            className="flex items-center text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => setShowAddForm(true)}
          >
            <CalendarPlus className="h-4 w-4 mr-1" />
            Add Treatment
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">New Scheduled Treatment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flock</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newVaccination.flockId}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, flockId: e.target.value }))}
                >
                  {data.flocks.map(flock => (
                    <option key={flock.id} value={flock.id}>{flock.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Type</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newVaccination.treatmentType}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, treatmentType: e.target.value as 'Vaccine' | 'Medication' | 'Supplement' }))}
                >
                  <option value="Vaccine">Vaccine</option>
                  <option value="Medication">Medication</option>
                  <option value="Supplement">Supplement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name</label>
                <input 
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={newVaccination.treatment || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, treatment: e.target.value }))}
                  placeholder="e.g. Newcastle Disease Vaccine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                <input 
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={typeof newVaccination.scheduledDate === 'string' ? newVaccination.scheduledDate.substring(0, 10) : ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                  value={newVaccination.notes || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                onClick={handleAddSchedule}
              >
                Schedule Treatment
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
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Treatment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Flock</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Treatment</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {completedVaccinations.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2">{formatDate(record.date)}</td>
                  <td className="px-4 py-2">{record.flockName}</td>
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${record.type === 'Vaccination' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">{record.notes}</td>
                </tr>
              ))}
              {completedVaccinations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No treatment history found.
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

export default VaccinationSchedule;

import { useState } from 'react';
import { AppData, EggProduction, SalesRecord } from '../types';
import { formatDate, formatCurrency, generateId, calculateEggProductionRate } from '../utils';
import { CirclePlus, DollarSign, Egg } from 'lucide-react';

interface ProductionProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Production = ({ data, setData }: ProductionProps) => {
  const [showAddEggForm, setShowAddEggForm] = useState(false);
  const [showAddSaleForm, setShowAddSaleForm] = useState(false);
  
  const [newEggRecord, setNewEggRecord] = useState<Partial<EggProduction>>({
    flockId: data.flocks.length > 0 ? data.flocks[0].id : '',
    quantity: 0,
    damaged: 0
  });
  
  const [newSaleRecord, setNewSaleRecord] = useState<Partial<SalesRecord>>({
    product: 'Eggs',
    quantity: 0,
    unitPrice: 0,
    customer: '',
    notes: ''
  });

  // Handler for adding new egg production record
  const handleAddEggRecord = () => {
    if (!newEggRecord.flockId || !newEggRecord.quantity) {
      alert('Please fill all required fields');
      return;
    }

    const selectedFlock = data.flocks.find(flock => flock.id === newEggRecord.flockId);
    
    const eggRecord: EggProduction = {
      id: generateId(),
      date: new Date().toISOString(),
      flockId: newEggRecord.flockId,
      flockName: selectedFlock ? selectedFlock.name : 'Unknown Flock',
      quantity: newEggRecord.quantity || 0,
      damaged: newEggRecord.damaged || 0
    };

    setData(prev => ({
      ...prev,
      eggProduction: [eggRecord, ...prev.eggProduction]
    }));

    // Reset form
    setNewEggRecord({
      flockId: newEggRecord.flockId,
      quantity: 0,
      damaged: 0
    });
    setShowAddEggForm(false);
  };

  // Handler for adding new sales record
  const handleAddSaleRecord = () => {
    if (!newSaleRecord.product || !newSaleRecord.quantity || !newSaleRecord.unitPrice) {
      alert('Please fill all required fields');
      return;
    }
    
    const saleRecord: SalesRecord = {
      id: generateId(),
      date: new Date().toISOString(),
      product: newSaleRecord.product as 'Eggs' | 'Meat' | 'Birds',
      quantity: newSaleRecord.quantity || 0,
      unitPrice: newSaleRecord.unitPrice || 0,
      customer: newSaleRecord.customer || 'Unknown',
      notes: newSaleRecord.notes || ''
    };

    setData(prev => ({
      ...prev,
      salesRecords: [saleRecord, ...prev.salesRecords]
    }));

    // Reset form
    setNewSaleRecord({
      product: 'Eggs',
      quantity: 0,
      unitPrice: 0,
      customer: '',
      notes: ''
    });
    setShowAddSaleForm(false);
  };

  // Calculate total egg production and revenue
  const totalEggs = data.eggProduction.reduce((sum, record) => sum + record.quantity, 0);
  const totalEggSales = data.salesRecords
    .filter(record => record.product === 'Eggs')
    .reduce((sum, record) => sum + (record.quantity * record.unitPrice), 0);

  // Calculate layer flocks data
  const layerFlocks = data.flocks.filter(flock => flock.birdType === 'Layer');
  const totalLayers = layerFlocks.reduce((sum, flock) => sum + flock.count, 0);
  
  // Get latest egg record
  const latestEggRecord = data.eggProduction[0];
  const latestProductionRate = latestEggRecord && totalLayers > 0 
    ? calculateEggProductionRate(latestEggRecord.quantity, totalLayers) 
    : '0%';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Production & Sales</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-start">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Egg className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Egg Production Summary</h2>
              <p className="text-sm text-gray-500 mb-3">Current metrics</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Total Eggs</p>
                  <p className="text-xl font-bold">{totalEggs}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Latest Rate</p>
                  <p className="text-xl font-bold">{latestProductionRate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-start">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sales Summary</h2>
              <p className="text-sm text-gray-500 mb-3">Revenue from sales</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Egg Sales</p>
                  <p className="text-xl font-bold">{formatCurrency(totalEggSales)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      data.salesRecords.reduce((sum, sale) => sum + (sale.quantity * sale.unitPrice), 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Egg Production Section */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Egg Production Records</h2>
            <button 
              className="flex items-center text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => setShowAddEggForm(true)}
            >
              <CirclePlus className="h-4 w-4 mr-1" />
              Add Record
            </button>
          </div>

          {showAddEggForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">New Egg Production</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flock</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newEggRecord.flockId}
                    onChange={(e) => setNewEggRecord(prev => ({ ...prev, flockId: e.target.value }))}
                  >
                    {data.flocks.map(flock => (
                      <option key={flock.id} value={flock.id}>{flock.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newEggRecord.quantity || ''}
                    onChange={(e) => setNewEggRecord(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Damaged Eggs</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newEggRecord.damaged || ''}
                    onChange={(e) => setNewEggRecord(prev => ({ ...prev, damaged: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                  onClick={handleAddEggRecord}
                >
                  Save Record
                </button>
                <button 
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-300"
                  onClick={() => setShowAddEggForm(false)}
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
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Damaged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.eggProduction.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2">{formatDate(record.date)}</td>
                    <td className="px-4 py-2">{record.flockName}</td>
                    <td className="px-4 py-2">{record.quantity}</td>
                    <td className="px-4 py-2">{record.damaged}</td>
                  </tr>
                ))}
                {data.eggProduction.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                      No production records found. Add your first record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Section */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Sales Records</h2>
            <button 
              className="flex items-center text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={() => setShowAddSaleForm(true)}
            >
              <CirclePlus className="h-4 w-4 mr-1" />
              Add Sale
            </button>
          </div>

          {showAddSaleForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">New Sales Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newSaleRecord.product}
                    onChange={(e) => setNewSaleRecord(prev => ({ ...prev, product: e.target.value as 'Eggs' | 'Meat' | 'Birds' }))}
                  >
                    <option value="Eggs">Eggs</option>
                    <option value="Meat">Meat</option>
                    <option value="Birds">Live Birds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input 
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newSaleRecord.quantity || ''}
                    onChange={(e) => setNewSaleRecord(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newSaleRecord.unitPrice || ''}
                    onChange={(e) => setNewSaleRecord(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <input 
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={newSaleRecord.customer}
                    onChange={(e) => setNewSaleRecord(prev => ({ ...prev, customer: e.target.value }))}
                    placeholder="e.g. Local Market"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                    value={newSaleRecord.notes}
                    onChange={(e) => setNewSaleRecord(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details..."
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                  onClick={handleAddSaleRecord}
                >
                  Save Record
                </button>
                <button 
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-300"
                  onClick={() => setShowAddSaleForm(false)}
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
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.salesRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2">{formatDate(record.date)}</td>
                    <td className="px-4 py-2">{record.product}</td>
                    <td className="px-4 py-2">{record.quantity}</td>
                    <td className="px-4 py-2">{record.customer}</td>
                    <td className="px-4 py-2">{formatCurrency(record.quantity * record.unitPrice)}</td>
                  </tr>
                ))}
                {data.salesRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                      No sales records found. Add your first sale.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Production;

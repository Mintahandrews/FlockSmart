import { useState } from 'react';
import { AppData, Expense } from '../types';
import { formatDate, formatCurrency, generateId } from '../utils';
import { Banknote, DollarSign, CirclePlus, TrendingUp, Wallet } from 'lucide-react';
import StatCard from '../components/StatCard';

interface FinancialDashboardProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const FinancialDashboard = ({ data, setData }: FinancialDashboardProps) => {
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: 'Feed',
    amount: 0,
    description: ''
  });

  // Calculate total revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSales = data.salesRecords.filter(
    sale => new Date(sale.date) >= thirtyDaysAgo
  );
  
  const monthlyRevenue = recentSales.reduce(
    (sum, sale) => sum + (sale.quantity * sale.unitPrice), 
    0
  );

  // Calculate total expenses (last 30 days)
  const recentExpenses = data.expenses.filter(
    expense => new Date(expense.date) >= thirtyDaysAgo
  );
  
  const monthlyExpenses = recentExpenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  );

  // Calculate total expenses all time
  const totalExpenses = data.expenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  );

  // Calculate profit
  const profit = monthlyRevenue - monthlyExpenses;
  const profitMargin = monthlyRevenue > 0 ? (profit / monthlyRevenue) * 100 : 0;

  // Group expenses by category for analysis
  const expensesByCategory = data.expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description) {
      alert('Please fill all required fields');
      return;
    }

    if (newExpense.amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }
    
    const expense: Expense = {
      id: generateId(),
      date: new Date().toISOString(),
      category: newExpense.category as 'Feed' | 'Medication' | 'Equipment' | 'Labor' | 'Utilities' | 'Other',
      amount: newExpense.amount || 0,
      description: newExpense.description || ''
    };

    setData(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses]
    }));

    // Reset form
    setNewExpense({
      category: 'Feed',
      amount: 0,
      description: ''
    });
    setShowAddExpenseForm(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(monthlyRevenue)} 
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        />
        <StatCard 
          title="Monthly Expenses" 
          value={formatCurrency(monthlyExpenses)} 
          icon={<Wallet className="h-6 w-6 text-blue-600" />}
        />
        <StatCard 
          title="Profit" 
          value={formatCurrency(profit)} 
          icon={<Banknote className="h-6 w-6 text-blue-600" />}
          trend={{ value: profitMargin, isPositive: profit > 0 }}
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(totalExpenses)} 
          icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">Expenses</h2>
              <button 
                className="flex items-center text-sm bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => setShowAddExpenseForm(true)}
              >
                <CirclePlus className="h-4 w-4 mr-1" />
                Add Expense
              </button>
            </div>

            {showAddExpenseForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-3">New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as any }))}
                    >
                      <option value="Feed">Feed</option>
                      <option value="Medication">Medication</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Labor">Labor</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GHS)*</label>
                    <input 
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <input 
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newExpense.description || ''}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Monthly feed order"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700"
                    onClick={handleAddExpense}
                  >
                    Save Expense
                  </button>
                  <button 
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm hover:bg-gray-300"
                    onClick={() => setShowAddExpenseForm(false)}
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
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Category</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-4 py-2">{formatDate(expense.date)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${expense.category === 'Feed' ? 'bg-green-100 text-green-800' : 
                            expense.category === 'Medication' ? 'bg-blue-100 text-blue-800' :
                            expense.category === 'Equipment' ? 'bg-purple-100 text-purple-800' :
                            expense.category === 'Labor' ? 'bg-yellow-100 text-yellow-800' :
                            expense.category === 'Utilities' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-2">{expense.description}</td>
                      <td className="px-4 py-2">{formatCurrency(expense.amount)}</td>
                    </tr>
                  ))}
                  {data.expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                        No expense records found. Add your first expense.
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
            <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
            
            {Object.keys(expensesByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="relative pt-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">{category}</span>
                      <span className="text-xs font-medium text-gray-700">{formatCurrency(amount)}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ 
                          width: `${(amount / totalExpenses) * 100}%` 
                        }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center
                          ${category === 'Feed' ? 'bg-green-500' : 
                          category === 'Medication' ? 'bg-blue-500' :
                          category === 'Equipment' ? 'bg-purple-500' :
                          category === 'Labor' ? 'bg-yellow-500' :
                          category === 'Utilities' ? 'bg-red-500' :
                          'bg-gray-500'}`}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Expenses:</span>
                    <span className="font-bold">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No expense data available</p>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-medium mb-2 text-sm">Financial Analysis</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Banknote className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>
                    {profit > 0 
                      ? `Your operation is profitable with a ${profitMargin.toFixed(1)}% margin.` 
                      : `Your operation is currently running at a loss.`}
                  </span>
                </li>
                {Object.entries(expensesByCategory).length > 0 && (
                  <li className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                      <TrendingUp className="h-3 w-3 text-blue-600" />
                    </div>
                    <span>
                      {Object.entries(expensesByCategory)
                        .sort((a, b) => b[1] - a[1])[0][0]} is your largest expense category at 
                      {((Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0][1] / totalExpenses) * 100).toFixed(1)}%.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

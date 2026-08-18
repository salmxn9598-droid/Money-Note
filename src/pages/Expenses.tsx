import { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseItem from '../components/ExpenseItem';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Expenses() {
  const { expenses, isLoading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(expenses.map(e => e.category)))];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = 
        expense.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, filterCategory]);

  // Group by date
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof expenses> = {};
    filteredExpenses.forEach(expense => {
      if (!groups[expense.date]) groups[expense.date] = [];
      groups[expense.date].push(expense);
    });
    // Sort dates descending
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        expenses: groups[date]
      }));
  }, [filteredExpenses]);

  return (
    <div className="max-w-md mx-auto w-full pb-8 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-semibold text-center mb-4">Spend List</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
          <input
            type="text"
            placeholder="Search shops, items, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-indigo-500/50 text-white placeholder-indigo-200 border-none rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 text-sm transition-all"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Category Filter */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center p-8 text-slate-500">Loading spend list...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium">No spends found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedExpenses.map(group => (
              <div key={group.date}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {new Date(group.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h3>
                  <Link to={`/daily/${group.date}`} className="text-xs text-indigo-600 font-medium hover:underline">
                    View Day
                  </Link>
                </div>
                <div className="space-y-3">
                  {group.expenses.map(expense => (
                    <ExpenseItem key={expense.id} expense={expense} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

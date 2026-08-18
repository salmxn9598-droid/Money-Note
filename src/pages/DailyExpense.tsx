import { useParams, useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { useMemo } from 'react';
import { formatCurrency } from '../utils/format';
import ExpenseItem from '../components/ExpenseItem';
import { ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function DailyExpense() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { expenses } = useExpenses();

  const dailyExpenses = useMemo(() => {
    return expenses.filter(e => e.date === date);
  }, [expenses, date]);

  const totalSpent = useMemo(() => {
    return dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [dailyExpenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    dailyExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [dailyExpenses]);

  if (!date) return null;

  return (
    <div className="max-w-md mx-auto w-full pb-8 min-h-screen bg-slate-50">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">
          {format(parseISO(date), 'd MMMM yyyy')}
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-md text-center">
          <div className="text-indigo-100 text-sm font-medium mb-1">Total Spent</div>
          <div className="text-4xl font-bold">{formatCurrency(totalSpent)}</div>
        </div>

        {categoryTotals.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Category Breakdown</h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
              {categoryTotals.map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {category.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{category}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Transactions</h2>
          {dailyExpenses.length === 0 ? (
            <p className="text-center text-slate-500 p-4 bg-white rounded-2xl border border-slate-100">No transactions for this day.</p>
          ) : (
            <div className="space-y-3">
              {dailyExpenses.map(expense => (
                <ExpenseItem key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

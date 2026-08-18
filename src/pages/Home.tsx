import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/format';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { IndianRupee, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { Expense } from '../types';
import ExpenseItem from '../components/ExpenseItem';

export default function Home() {
  const { expenses, isLoading } = useExpenses();

  const stats = useMemo(() => {
    const today = expenses.filter((e) => isToday(parseISO(e.date)));
    const week = expenses.filter((e) => isThisWeek(parseISO(e.date)));
    const month = expenses.filter((e) => isThisMonth(parseISO(e.date)));

    const todayTotal = today.reduce((sum, e) => sum + e.amount, 0);
    const weekTotal = week.reduce((sum, e) => sum + e.amount, 0);
    const monthTotal = month.reduce((sum, e) => sum + e.amount, 0);

    const highestToday = today.length > 0 ? Math.max(...today.map(e => e.amount)) : 0;

    const paymentCounts = today.reduce((acc, e) => {
      acc[e.paymentMethod] = (acc[e.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostUsedPayment = Object.entries(paymentCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || 'N/A';

    const categoryTotals = today.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.entries(categoryTotals).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      todayTotal,
      weekTotal,
      monthTotal,
      todayCount: today.length,
      highestToday,
      mostUsedPayment,
      topCategory,
      recent: expenses.slice(0, 5), // last 5
    };
  }, [expenses]);

  if (isLoading) {
    return <div className="p-4 text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="pb-8 max-w-md mx-auto w-full">
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-md">
        <h1 className="text-xl font-medium opacity-90 mb-1">Today's Expense</h1>
        <div className="text-4xl font-bold mb-6">{formatCurrency(stats.todayTotal)}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-500/30 rounded-xl p-3">
            <div className="text-xs opacity-80 mb-1">This Week</div>
            <div className="text-lg font-semibold">{formatCurrency(stats.weekTotal)}</div>
          </div>
          <div className="bg-indigo-500/30 rounded-xl p-3">
            <div className="text-xs opacity-80 mb-1">This Month</div>
            <div className="text-lg font-semibold">{formatCurrency(stats.monthTotal)}</div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-2">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Today's Insights</h2>
        <div className="grid grid-cols-2 gap-3">
          <InsightCard icon={<IndianRupee size={18} />} label="Highest" value={formatCurrency(stats.highestToday)} />
          <InsightCard icon={<ShoppingBag size={18} />} label="Top Category" value={stats.topCategory} />
          <InsightCard icon={<CreditCard size={18} />} label="Top Payment" value={stats.mostUsedPayment} />
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
             <div className="text-2xl font-bold text-indigo-600">{stats.todayCount}</div>
             <div className="text-xs text-slate-500 font-medium">Transactions</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
          <Link to="/expenses" className="text-sm font-medium text-indigo-600 flex items-center hover:underline">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {stats.recent.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-500 mb-4">No expenses recorded yet.</p>
            <Link to="/add" className="inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
              Add First Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recent.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InsightCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-start space-x-3">
      <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="text-sm font-semibold text-slate-800 truncate">{value}</div>
      </div>
    </div>
  );
}


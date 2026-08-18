import { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/format';
import { isThisMonth, parseISO, format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#14b8a6', '#f43f5e'];

export default function Analytics() {
  const { expenses } = useExpenses();

  const analyticsData = useMemo(() => {
    const thisMonthExpenses = expenses.filter(e => isThisMonth(parseISO(e.date)));
    const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Highest spending day & transaction
    let highestDayAmount = 0;
    let highestDay = '';
    let highestTransaction = 0;
    
    const dailyTotals: Record<string, number> = {};
    
    thisMonthExpenses.forEach(e => {
      dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
      if (e.amount > highestTransaction) highestTransaction = e.amount;
    });

    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (amount > highestDayAmount) {
        highestDayAmount = amount;
        highestDay = date;
      }
    });

    // Bar chart data
    const barData = Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date: format(parseISO(date), 'dd MMM'),
        rawDate: date,
        amount
      }))
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));

    // Category Pie Data
    const categoryTotals: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Payment Method Pie Data
    const paymentTotals: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      paymentTotals[e.paymentMethod] = (paymentTotals[e.paymentMethod] || 0) + e.amount;
    });
    const paymentData = Object.entries(paymentTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      totalSpent,
      highestDay,
      highestDayAmount,
      highestTransaction,
      barData,
      categoryData,
      paymentData
    };
  }, [expenses]);

  return (
    <div className="max-w-md mx-auto w-full pb-8 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-semibold text-center">Monthly Analytics</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="text-sm text-slate-500 font-medium mb-1">Total Monthly Spending</div>
          <div className="text-4xl font-bold text-slate-800 mb-6">{formatCurrency(analyticsData.totalSpent)}</div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Highest Day</div>
              <div className="font-semibold text-slate-800">{formatCurrency(analyticsData.highestDayAmount)}</div>
              <div className="text-[10px] text-slate-400 mt-1">{analyticsData.highestDay ? format(parseISO(analyticsData.highestDay), 'dd MMM yyyy') : '-'}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">Highest Txn</div>
              <div className="font-semibold text-slate-800">{formatCurrency(analyticsData.highestTransaction)}</div>
            </div>
          </div>
        </div>

        {/* Daily Spending Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Daily Spending</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Spending by Category</h2>
          <div className="h-48 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {analyticsData.categoryData.map((entry, index) => (
              <div key={entry.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {analyticsData.paymentData.map((entry, index) => (
              <div key={entry.name} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">{entry.name}</span>
                <span className="font-semibold text-slate-800">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

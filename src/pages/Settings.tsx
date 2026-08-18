import React, { useState, useEffect, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/format';
import { format, isThisMonth, parseISO } from 'date-fns';
import { Wallet, BellRing, Shield, Download } from 'lucide-react';

export default function Settings() {
  const { expenses, getBudget, setBudget } = useExpenses();
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const currentMonth = format(new Date(), 'yyyy-MM');

  const thisMonthExpenses = useMemo(() => {
    return expenses.filter(e => isThisMonth(parseISO(e.date))).reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  useEffect(() => {
    async function loadBudget() {
      const budget = await getBudget(currentMonth);
      if (budget) {
        setBudgetAmount(budget.amount.toString());
      }
    }
    loadBudget();
  }, [currentMonth, getBudget]);

  const handleSaveBudget = async () => {
    const amt = Number(budgetAmount);
    if (!isNaN(amt)) {
      await setBudget({ month: currentMonth, amount: amt });
    }
    setIsEditingBudget(false);
  };

  const budgetValue = Number(budgetAmount) || 0;
  const progress = budgetValue > 0 ? Math.min((thisMonthExpenses / budgetValue) * 100, 100) : 0;
  const isWarning = progress > 85;

  return (
    <div className="max-w-md mx-auto w-full pb-8 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-semibold text-center">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Budget Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <Wallet size={20} />
            </div>
            <h2 className="text-base font-semibold text-slate-800">Monthly Budget</h2>
          </div>

          <div className="space-y-4">
            {isEditingBudget ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  placeholder="Enter amount"
                />
                <button
                  onClick={handleSaveBudget}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Budget Limit</div>
                  <div className="text-2xl font-bold text-slate-800">{budgetValue > 0 ? formatCurrency(budgetValue) : 'Not set'}</div>
                </div>
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="text-indigo-600 text-sm font-medium hover:underline mb-1"
                >
                  Edit
                </button>
              </div>
            )}

            {budgetValue > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-medium mb-2">
                  <span className="text-slate-600">Spent: {formatCurrency(thisMonthExpenses)}</span>
                  <span className={isWarning ? 'text-red-500' : 'text-slate-600'}>
                    Remaining: {formatCurrency(Math.max(budgetValue - thisMonthExpenses, 0))}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isWarning ? 'bg-red-500' : 'bg-indigo-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {isWarning && (
                  <div className="text-xs text-red-500 mt-2 flex items-center">
                    <BellRing size={12} className="mr-1" />
                    You are approaching your budget limit!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security & Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
            <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Data Security</h2>
              <p className="text-xs text-slate-500 mt-0.5">All your data is stored securely on your device.</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-3 opacity-60">
            <div className="bg-slate-50 p-2 rounded-lg text-slate-600">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Export Data (Coming Soon)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Export your expenses to CSV or Excel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

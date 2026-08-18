import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { PaymentMethod, Category } from '../types';
import { format } from 'date-fns';

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Debit Card', 'Credit Card', 'Cash', 'Bank Transfer', 'Other'];
const CATEGORIES: Category[] = ['Shopping', 'Food', 'Travel', 'Grocery', 'Bills', 'Entertainment', 'Education', 'Medical', 'Other'];

export default function AddExpense() {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    paymentMethod: 'UPI' as PaymentMethod,
    merchantName: '',
    category: 'Food' as Category,
    itemName: '',
    notes: '',
    isRecurring: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;
    
    setIsSubmitting(true);
    try {
      await addExpense({
        amount: Number(formData.amount),
        date: formData.date,
        time: formData.time,
        paymentMethod: formData.paymentMethod,
        merchantName: formData.merchantName,
        category: formData.category,
        itemName: formData.itemName,
        notes: formData.notes,
        isRecurring: formData.isRecurring,
      });
      navigate(-1); // Go back
    } catch (error) {
      console.error('Failed to add expense', error);
      alert('Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full pb-8">
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-semibold text-center">Add Expense</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center mb-4">
            <label className="block text-sm text-slate-500 font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="text-4xl font-bold text-center w-full bg-transparent outline-none border-b-2 border-slate-100 focus:border-indigo-500 transition-colors pb-2 text-slate-800"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1">Time</label>
              <input
                type="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    formData.category === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Payment Method</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    formData.paymentMethod === method
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Shop / Merchant</label>
            <input
              type="text"
              name="merchantName"
              required
              value={formData.merchantName}
              onChange={handleChange}
              placeholder="E.g. XYZ Jeans Store"
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">What did you buy?</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="E.g. Blue jeans"
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add some details..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-slate-50 resize-none"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="isRecurring" 
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="isRecurring" className="text-sm text-slate-700 font-medium">Mark as recurring expense</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 mt-4"
        >
          {isSubmitting ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { PaymentMethod, Category } from '../types';
import { Trash2 } from 'lucide-react';

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Debit Card', 'Credit Card', 'Cash', 'Bank Transfer', 'Other'];
const CATEGORIES: Category[] = ['Shopping', 'Food', 'Travel', 'Grocery', 'Bills', 'Entertainment', 'Education', 'Medical', 'Other'];

export default function EditExpense() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expenses, updateExpense, deleteExpense } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseToEdit = expenses.find(e => e.id === id);

  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    time: '',
    paymentMethod: 'UPI' as PaymentMethod,
    merchantName: '',
    category: 'Food' as Category,
    itemName: '',
    notes: '',
    isRecurring: false,
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date,
        time: expenseToEdit.time,
        paymentMethod: expenseToEdit.paymentMethod,
        merchantName: expenseToEdit.merchantName,
        category: expenseToEdit.category,
        itemName: expenseToEdit.itemName || '',
        notes: expenseToEdit.notes || '',
        isRecurring: expenseToEdit.isRecurring || false,
      });
    }
  }, [expenseToEdit]);

  if (!expenseToEdit) {
    return <div className="p-8 text-center">Expense not found</div>;
  }

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
      await updateExpense({
        ...expenseToEdit,
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
      console.error('Failed to update expense', error);
      alert('Failed to update expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(expenseToEdit.id);
      navigate(-1);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full pb-8">
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-semibold text-center flex-1">Edit Expense</h1>
        <button onClick={handleDelete} className="p-2 bg-indigo-700 rounded-full hover:bg-red-500 transition-colors">
          <Trash2 size={18} />
        </button>
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

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-white text-slate-700 border border-slate-200 font-semibold py-4 rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

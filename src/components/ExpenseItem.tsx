import React from 'react';
import { formatCurrency } from '../utils/format';
import { format, parseISO } from 'date-fns';
import { Expense } from '../types';
import { Link } from 'react-router-dom';

const ExpenseItem: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <Link to={`/edit/${expense.id}`} className="block">
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]">
        <div className="flex items-center space-x-3 overflow-hidden pr-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-sm">
            {expense.category.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 truncate">{expense.merchantName || expense.category}</div>
            <div className="text-xs text-slate-500 flex items-center whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="truncate">{expense.paymentMethod}</span>
              <span className="mx-1 flex-shrink-0">•</span>
              <span className="flex-shrink-0">{format(parseISO(`${expense.date}T${expense.time}`), 'h:mm a')}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="font-semibold text-slate-800">{formatCurrency(expense.amount)}</div>
          {expense.itemName && (
            <div className="text-xs text-slate-500 truncate max-w-[80px] ml-auto">{expense.itemName}</div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ExpenseItem;



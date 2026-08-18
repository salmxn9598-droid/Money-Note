export type PaymentMethod =
  | 'UPI'
  | 'Debit Card'
  | 'Credit Card'
  | 'Cash'
  | 'Bank Transfer'
  | 'Other';

export type Category =
  | 'Shopping'
  | 'Food'
  | 'Travel'
  | 'Grocery'
  | 'Bills'
  | 'Entertainment'
  | 'Education'
  | 'Medical'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  paymentMethod: PaymentMethod;
  merchantName: string;
  category: Category;
  itemName: string;
  notes: string;
  isRecurring: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  amount: number;
  month: string; // YYYY-MM
}

export interface RecurringExpense {
  id: string;
  expenseId: string;
  frequency: 'monthly' | 'weekly' | 'yearly';
  nextDueDate: string;
}

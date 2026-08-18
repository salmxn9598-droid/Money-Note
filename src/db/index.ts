import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Expense, Budget, RecurringExpense } from '../types';

interface ExpenseTrackerDB extends DBSchema {
  expenses: {
    key: string;
    value: Expense;
    indexes: {
      'by-date': string;
      'by-category': string;
      'by-payment': string;
    };
  };
  budgets: {
    key: string;
    value: Budget;
  };
  recurring: {
    key: string;
    value: RecurringExpense;
    indexes: {
      'by-date': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ExpenseTrackerDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ExpenseTrackerDB>('expense-tracker', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
          expenseStore.createIndex('by-date', 'date');
          expenseStore.createIndex('by-category', 'category');
          expenseStore.createIndex('by-payment', 'paymentMethod');
        }
        if (!db.objectStoreNames.contains('budgets')) {
          db.createObjectStore('budgets', { keyPath: 'month' });
        }
        if (!db.objectStoreNames.contains('recurring')) {
          const recurringStore = db.createObjectStore('recurring', { keyPath: 'id' });
          recurringStore.createIndex('by-date', 'nextDueDate');
        }
      },
    });
  }
  return dbPromise;
}

export const dbApi = {
  async addExpense(expense: Expense) {
    const db = await getDB();
    await db.put('expenses', expense);
  },
  async getExpenses(): Promise<Expense[]> {
    const db = await getDB();
    const expenses = await db.getAll('expenses');
    return expenses.sort((a, b) => b.createdAt - a.createdAt);
  },
  async updateExpense(expense: Expense) {
    const db = await getDB();
    await db.put('expenses', expense);
  },
  async deleteExpense(id: string) {
    const db = await getDB();
    await db.delete('expenses', id);
  },
  async getBudget(month: string): Promise<Budget | undefined> {
    const db = await getDB();
    return db.get('budgets', month);
  },
  async setBudget(budget: Budget) {
    const db = await getDB();
    await db.put('budgets', budget);
  },
};

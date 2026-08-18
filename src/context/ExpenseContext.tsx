import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Expense, Budget } from '../types';
import { dbApi } from '../db';
import { format } from 'date-fns';

interface ExpenseContextType {
  expenses: Expense[];
  isLoading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getBudget: (month: string) => Promise<Budget | undefined>;
  setBudget: (budget: Budget) => Promise<void>;
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dbApi.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await dbApi.addExpense(newExpense);
    await refreshExpenses();
  };

  const updateExpense = async (expense: Expense) => {
    await dbApi.updateExpense({ ...expense, updatedAt: Date.now() });
    await refreshExpenses();
  };

  const deleteExpense = async (id: string) => {
    await dbApi.deleteExpense(id);
    await refreshExpenses();
  };

  const getBudget = async (month: string) => {
    return await dbApi.getBudget(month);
  };

  const setBudget = async (budget: Budget) => {
    await dbApi.setBudget(budget);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        getBudget,
        setBudget,
        refreshExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}

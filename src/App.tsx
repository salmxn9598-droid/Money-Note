/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DailyExpense from './pages/DailyExpense';
import EditExpense from './pages/EditExpense';

export default function App() {
  return (
    <ExpenseProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 pb-16">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/add" element={<AddExpense />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/daily/:date" element={<DailyExpense />} />
              <Route path="/edit/:id" element={<EditExpense />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
    </ExpenseProvider>
  );
}


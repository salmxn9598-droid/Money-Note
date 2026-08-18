import { NavLink } from 'react-router-dom';
import { Home, List, PlusCircle, PieChart, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/expenses', icon: List, label: 'Spend List' },
    { to: '/add', icon: PlusCircle, label: 'Add', special: true },
    { to: '/analytics', icon: PieChart, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 safe-area-pb z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full transition-colors ${
                item.special
                  ? 'text-indigo-600'
                  : isActive
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {item.special ? (
              <div className="bg-indigo-600 text-white p-3 rounded-full -mt-6 shadow-lg hover:bg-indigo-700 transition-colors">
                <item.icon size={28} />
              </div>
            ) : (
              <>
                <item.icon size={24} className="mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

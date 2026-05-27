import React from 'react';
import { Home, Receipt, PieChart, Settings, Plus } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onAddClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, onAddClick }) => {
  return (
    <div id="app_navbar" className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-between shadow-lg">
      <button 
        id="nav_btn_home"
        onClick={() => setTab('home')}
        className={`flex flex-col items-center justify-center space-y-1 w-14 transition-all duration-200 ${
          currentTab === 'home' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] uppercase tracking-wider font-semibold">Home</span>
      </button>

      <button 
        id="nav_btn_txns"
        onClick={() => setTab('transactions')}
        className={`flex flex-col items-center justify-center space-y-1 w-14 transition-all duration-200 ${
          currentTab === 'transactions' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Receipt className="w-6 h-6" />
        <span className="text-[10px] uppercase tracking-wider font-semibold font-sans">Txns</span>
      </button>

      {/* Floated Giant circular addition button */}
      <div className="relative -top-6">
        <button 
          id="nav_btn_add"
          onClick={onAddClick}
          className="w-14 h-14 bg-indigo-950 text-white rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(30,27,75,0.3)] hover:bg-neutral-900 transition-all duration-200 hover:scale-105 border-4 border-white"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      <button 
        id="nav_btn_stats"
        onClick={() => setTab('statistics')}
        className={`flex flex-col items-center justify-center space-y-1 w-14 transition-all duration-200 ${
          currentTab === 'statistics' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <PieChart className="w-6 h-6" />
        <span className="text-[10px] uppercase tracking-wider font-semibold">Stats</span>
      </button>

      <button 
        id="nav_btn_settings"
        onClick={() => setTab('settings')}
        className={`flex flex-col items-center justify-center space-y-1 w-14 transition-all duration-200 ${
          currentTab === 'settings' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Settings className="w-6 h-6" />
        <span className="text-[10px] uppercase tracking-wider font-semibold">Settings</span>
      </button>
    </div>
  );
};
export default Navbar;

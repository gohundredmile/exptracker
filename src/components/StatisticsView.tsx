import React, { useState } from 'react';
import { useData } from '../lib/dataContext';
import { INITIAL_CATEGORIES } from '../lib/mockData';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  SlidersHorizontal, 
  Calendar
} from 'lucide-react';

export const StatisticsView: React.FC = () => {
  const { transactions, getCurrencySymbol } = useData();

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'total'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const currencySymbol = getCurrencySymbol();

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Group transaction categories for the selected period
  const getPeriodFilteredExpenses = () => {
    return transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      
      if (activeTab === 'monthly') {
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      } else if (activeTab === 'daily') {
        // Today
        const todayStr = new Date().toISOString().split('T')[0];
        return t.date === todayStr;
      } else if (activeTab === 'weekly') {
        // Simple approximate last 7 days calculation
        const tTime = d.getTime();
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return tTime >= weekAgo;
      } else {
        // Total (All)
        return true;
      }
    });
  };

  const currentExpenses = getPeriodFilteredExpenses();
  const totalSpendSum = currentExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Group by Category helper
  const categoryChartData = INITIAL_CATEGORIES.map(cat => {
    const totalAmount = currentExpenses
      .filter(t => t.category.toLowerCase() === cat.id.toLowerCase())
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percentage = totalSpendSum > 0 ? (totalAmount / totalSpendSum) * 100 : 0;

    // Tailwind-like hex colors matcher for Recharts
    let hexColor = '#6366F1'; // Default Indigo
    switch (cat.id) {
      case 'alcohol': hexColor = '#B45309'; break; // Amber-700
      case 'beauty': hexColor = '#F43F5E'; break; // Rose-500
      case 'bills': hexColor = '#9333EA'; break; // Purple-600
      case 'car': hexColor = '#3B82F6'; break; // Blue-500
      case 'cigarettes': hexColor = '#7C2D12'; break; // orange-900 / amber-900
      case 'clothing': hexColor = '#4F46E5'; break; // Indigo-600
      case 'donations': hexColor = '#EF4444'; break; // Red-500
      case 'education': hexColor = '#0EA5E9'; break; // Sky-500
      case 'electronics': hexColor = '#06B6D4'; break; // Cyan-500
    }

    return {
      name: cat.name,
      value: Number(totalAmount.toFixed(2)),
      percentage: Number(percentage.toFixed(1)),
      color: hexColor,
      rawColorClass: cat.color
    };
  }).filter(item => item.value > 0);

  // Fallback empty placeholder circle structured like Screen 4 and Screen 10
  const placeholderData = [
    { name: 'No Data', value: 100, color: '#E2E8F0' }
  ];

  return (
    <div className="pb-24 pt-4 px-4 bg-[#F8FAFC]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-5 px-1">
        <button className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-black text-slate-800 tracking-tight text-center uppercase">Statistics</h2>
        <button className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* Month Dropdown Selector Pill */}
      <div className="flex justify-center mb-5 relative">
        <button 
          id="btn_stat_month_dropdown"
          onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          className="bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm text-xs font-black text-slate-700 flex items-center space-x-1.5 focus:ring-1 focus:ring-indigo-100 focus:outline-none"
        >
          <span>{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
          <span className="text-[9px] text-slate-400">▼</span>
        </button>

        {showMonthDropdown && (
          <div className="absolute top-11 bg-white border rounded-xl shadow-lg z-50 p-2 grid grid-cols-3 gap-1.5 w-68 animate-in fade-in duration-100">
            {MONTH_NAMES.map((mName, idx) => (
              <button 
                key={mName}
                type="button"
                onClick={() => {
                  setSelectedMonth(idx);
                  setShowMonthDropdown(false);
                }}
                className={`py-1 rounded text-[10px] font-semibold tracking-wide ${
                  selectedMonth === idx ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {mName.substring(0, 3)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter tab bar metrics: Daily, Weekly, Monthly, Total */}
      <div className="border-b border-slate-150 flex justify-between items-center px-4 mb-6 relative">
        <button 
          id="tab_daily"
          onClick={() => setActiveTab('daily')}
          className={`pb-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'daily' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Daily
          {activeTab === 'daily' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-950 rounded" />}
        </button>
        <button 
          id="tab_weekly"
          onClick={() => setActiveTab('weekly')}
          className={`pb-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'weekly' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Weekly
          {activeTab === 'weekly' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-950 rounded" />}
        </button>
        <button 
          id="tab_monthly"
          onClick={() => setActiveTab('monthly')}
          className={`pb-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'monthly' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Monthly
          {activeTab === 'monthly' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-950 rounded animate-in fade-in duration-300" />}
        </button>
        <button 
          id="tab_total"
          onClick={() => setActiveTab('total')}
          className={`pb-2.5 text-xs font-bold transition-all relative ${
            activeTab === 'total' ? 'text-indigo-950 font-black' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Total
          {activeTab === 'total' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-950 rounded" />}
        </button>
      </div>

      {/* Total Spending Label & Amount Banner */}
      <div className="text-center mb-6">
        <p className="text-[10px] tracking-widest text-[#94A3B8] font-bold uppercase font-sans">
          Total Spending ({activeTab})
        </p>
        <h3 className="text-4xl font-extrabold text-[#0F172A] mt-1.5 font-mono select-all">
          {currencySymbol}{totalSpendSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
      </div>

      {/* Expense Structure Chart Canvas Container with resize observation */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-5 relative flex flex-col items-center">
        <h4 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase text-center mb-3 self-start pl-1">
          Expense Structure
        </h4>

        {/* 100% responsive donut chart frame */}
        <div className="w-full h-56 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            {categoryChartData.length > 0 ? (
              <RePieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${currencySymbol}${value}`, 'Spend']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: '11px' }}
                />
              </RePieChart>
            ) : (
              // Empty Gray Circle mirroring Image 4 
              <RePieChart>
                <Pie
                  data={placeholderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  <Cell fill="#EEF2F6" />
                </Pie>
              </RePieChart>
            )}
          </ResponsiveContainer>

          {/* Core display text label inside the donut circle */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Expense</span>
            <span className="text-sm font-extrabold text-slate-800 mt-0.5">
              {currencySymbol}{totalSpendSum.toFixed(0)}
            </span>
          </div>
        </div>

        {/* If no data, display helper as shown in Screen 4 */}
        {categoryChartData.length === 0 && (
          <div className="text-center mt-2.5 pb-2">
            <p className="text-xs font-bold text-slate-850">No expense data</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 max-w-[200px]">
              Add some expenses or pick another frequency to see your structure details.
            </p>
          </div>
        )}
      </div>

      {/* Screen 10 custom Expense breakdown details cards */}
      {categoryChartData.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <p className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase border-b pb-2">Breakdown</p>
          
          <div className="space-y-3.5">
            {categoryChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-700">{item.name}</span>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <span className="text-xs font-mono font-black text-slate-850">
                    {currencySymbol}{item.value.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md min-w-[44px] text-center">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default StatisticsView;

import React, { useState } from 'react';
import { useData } from '../lib/dataContext';
import { INITIAL_CATEGORIES } from '../lib/mockData';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Trash2, 
  Search,
  Calendar,
  FileText
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { 
    transactions, 
    deleteTransaction, 
    getCurrencySymbol 
  } = useData();

  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');

  const currencySymbol = getCurrencySymbol();

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Adjust month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(p => p - 1);
    } else {
      setSelectedMonth(p => p - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(p => p + 1);
    } else {
      setSelectedMonth(p => p + 1);
    }
  };

  // Filter transactions for chosen month / year & type
  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    // Be robust with UTC or offset mismatches: check if split matches
    const dateYear = tDate.getFullYear();
    const dateMonth = tDate.getMonth();
    
    const matchesMonth = dateYear === selectedYear && dateMonth === selectedMonth;
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = searchQuery === '' || 
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMonth && matchesType && matchesSearch;
  });

  // Calculations for current month's summaries
  const monthIncome = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth && t.type === 'income';
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthExpense = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth && t.type === 'expense';
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthTotal = Number((monthIncome - monthExpense).toFixed(2));

  // Category attributes finder
  const getCategoryDetails = (catId: string) => {
    return INITIAL_CATEGORIES.find(c => c.id === catId.toLowerCase()) || {
      name: catId,
      icon: 'HelpCircle',
      color: 'text-slate-500',
      bg: 'bg-slate-50'
    };
  };

  return (
    <div className="pb-24 pt-4 px-4 bg-[#F8FAFC]">
      {/* Month slide header container */}
      <div className="flex items-center justify-between mb-5 select-none bg-white py-2 px-3 rounded-full border border-slate-100 shadow-sm">
        <button 
          id="btn_prev_month"
          onClick={handlePrevMonth}
          className="p-1 text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-slate-800">
          {MONTH_NAMES[selectedMonth]} {selectedYear}
        </span>
        <button 
          id="btn_next_month"
          onClick={handleNextMonth}
          className="p-1 text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Screen 5: Summary Cards of current navigation month */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Income column card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
          <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Income</p>
          <p className="text-xs font-black text-emerald-500 font-mono mt-1">
            {currencySymbol}{monthIncome.toFixed(2)}
          </p>
        </div>

        {/* Expense column card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
          <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-1.5">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
          <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Expense</p>
          <p className="text-xs font-black text-rose-500 font-mono mt-1">
            {currencySymbol}{monthExpense.toFixed(2)}
          </p>
        </div>

        {/* Saved/Net column card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm text-center">
          <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1.5">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider font-sans">Total</p>
          <p className={`text-xs font-black font-mono mt-1 ${monthTotal >= 0 ? 'text-[#1E1B4B]' : 'text-rose-500'}`}>
            {currencySymbol}{monthTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Segmented Filter Option Tabs */}
      <div className="bg-slate-100/80 p-1 rounded-xl grid grid-cols-3 gap-1 mb-4">
        <button 
          id="btn_filter_all"
          onClick={() => setFilterType('all')}
          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterType === 'all' 
              ? 'bg-indigo-950 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All
        </button>
        <button 
          id="btn_filter_expense"
          onClick={() => setFilterType('expense')}
          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterType === 'expense' 
              ? 'bg-indigo-950 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Expense
        </button>
        <button 
          id="btn_filter_income"
          onClick={() => setFilterType('income')}
          className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
            filterType === 'income' 
              ? 'bg-indigo-950 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Income
        </button>
      </div>

      {/* Non-intrusive Search Filter */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
        <input 
          type="text" 
          placeholder="Search by category, tags, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Transactions list header info banner */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold px-1.5">
        <span>{filteredTransactions.length} Transactions</span>
        <span>{MONTH_NAMES[selectedMonth]} Summarized</span>
      </div>

      {/* Transactions main stack layout */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(t => {
            const cat = getCategoryDetails(t.category);
            const dateObj = new Date(t.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div 
                key={t.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition group"
              >
                <div className="flex items-center space-x-3.5">
                  {/* Circular category icon wrapper */}
                  <div className={`w-10 h-10 rounded-full ${cat.bg} flex items-center justify-center text-base`}>
                    <span className={`font-semibold ${cat.color}`}>{cat.name[0]}</span>
                  </div>

                  <div>
                    <h5 className="text-sm font-bold text-slate-800 truncate max-w-[170px] capitalize">
                      {t.note || cat.name}
                    </h5>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1 font-semibold">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span className="uppercase text-[9px] tracking-wider bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">
                        {t.paid_for}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className={`text-sm font-black font-mono ${
                    t.type === 'expense' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {t.type === 'expense' ? '-' : '+'}{currencySymbol}{Number(t.amount).toFixed(2)}
                  </span>

                  <button 
                    id={`btn_delete_tx_${t.id}`}
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded transition opacity-50 group-hover:opacity-100"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty state mirroring Screen 5 exactly */
          <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-md font-bold text-slate-800">No transactions yet</h4>
            <p className="text-xs text-slate-400 font-semibold mt-1.5 px-6">
              Tap the plus (+) button to add your first transaction or select another month.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TransactionsView;

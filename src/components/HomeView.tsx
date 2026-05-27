import React, { useState } from 'react';
import { useData } from '../lib/dataContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  CreditCard, 
  Flame, 
  Heart, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  CalendarDays, 
  Lock, 
  Users, 
  Star, 
  Ghost, 
  Activity, 
  Sparkles,
  HelpCircle,
  Plus,
  ArrowRight,
  ChevronRight,
  Database,
  CheckCircle2
} from 'lucide-react';

interface HomeViewProps {
  onAddTransactionClick: () => void;
  setTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onAddTransactionClick, setTab }) => {
  const { 
    activeProfile, 
    accounts, 
    transactions, 
    challenge, 
    recurringItems, 
    settings, 
    getCurrencySymbol, 
    isSupabaseConnected,
    addAccount,
    updateChallenge,
    updateRecurringItem,
    addTransaction
  } = useData();

  const [selectedRecurring, setSelectedRecurring] = useState<string | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  
  // States for adding a new account
  const [newAccName, setNewAccName] = useState('');
  const [newAccBalance, setNewAccBalance] = useState('');
  const [newAccType, setNewAccType] = useState<'bank' | 'credit'>('bank');

  // States for adding recurring item amount
  const [recurAmountInput, setRecurAmountInput] = useState('');
  const [recurNameInput, setRecurNameInput] = useState('');

  const currencySymbol = getCurrencySymbol();

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const bankSum = accounts
    .filter(a => a.type === 'bank')
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const creditSum = accounts
    .filter(a => a.type === 'credit')
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const totalCalculatedBalance = Number((bankSum - creditSum).toFixed(2));

  // Daily Avg Expenses
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const distinctDays = new Set(expenseTransactions.map(t => t.date.split('T')[0])).size || 1;
  const dailyAverageExpenses = expenseTransactions.length > 0 
    ? Number((totalExpense / distinctDays).toFixed(2)) 
    : 0.00;

  // Savings %
  const savingsPercent = totalIncome > 0 
    ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))) 
    : 0;

  // Streak tracker logic
  const getNoSpendStreak = () => {
    // Return custom input or calculated streak
    let streak = challenge.streak;
    if (expenseTransactions.length === 0 && totalIncome > 0) {
      streak = 4; // Fun simulated boost
    }
    return streak;
  };

  // Health Score (based on actual budget or simple rules)
  // Low balance or expenses near/over income triggers lower rating
  let healthScore = 10;
  let healthLabel = 'Excellent';
  let healthColor = 'text-green-500';
  let healthBg = 'bg-green-50';

  if (totalExpense > 0) {
    const ratio = totalExpense / (settings.monthlyIncome || totalIncome || 1);
    if (ratio >= 1.0) {
      healthScore = 2;
      healthLabel = 'Critical';
      healthColor = 'text-red-500';
      healthBg = 'bg-red-50';
    } else if (ratio > 0.8) {
      healthScore = 5;
      healthLabel = 'Critical';
      healthColor = 'text-red-500 font-bold';
      healthBg = 'bg-red-50';
    } else if (ratio > 0.5) {
      healthScore = 7;
      healthLabel = 'Moderate';
      healthColor = 'text-amber-500';
      healthBg = 'bg-amber-50';
    } else {
      healthScore = 9;
      healthLabel = 'Good';
      healthColor = 'text-emerald-500 font-semibold';
      healthBg = 'bg-emerald-50';
    }
  } else {
    // Default fallback
    healthScore = 5; 
    healthLabel = 'Critical';
    healthColor = 'text-red-500';
    healthBg = 'bg-red-50';
  }

  // Handle adding new account
  const handleAddNewAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName || !newAccBalance) return;
    
    await addAccount({
      name: newAccName,
      balance: parseFloat(newAccBalance) || 0,
      type: newAccType,
      icon: newAccType === 'bank' ? 'Building' : 'CreditCard'
    });

    setNewAccName('');
    setNewAccBalance('');
    setShowAddAccountModal(false);
  };

  // Handle incrementing challenge
  const handleIncrementChallenge = () => {
    const nextCurrent = Math.min(challenge.total, challenge.current + 1);
    const nextStreak = nextCurrent === challenge.total ? challenge.streak + 1 : challenge.streak;
    updateChallenge({
      current: nextCurrent,
      streak: nextStreak
    });
  };

  // Handle adding recurring detail
  const handleAddRecurringDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecurring || !recurAmountInput || !recurNameInput) return;
    
    const amountVal = parseFloat(recurAmountInput) || 0;
    const targetItem = recurringItems.find(r => r.id === selectedRecurring);
    
    if (targetItem) {
      const nextCount = targetItem.count + 1;
      const nextTotalAmount = targetItem.amount + amountVal;
      
      await updateRecurringItem(selectedRecurring, {
        count: nextCount,
        amount: nextTotalAmount,
        description: `Logged ${nextCount} item(s) total: ${currencySymbol}${nextTotalAmount.toFixed(2)}`
      });

      // Automatically post transaction
      await addTransaction({
        amount: amountVal,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        category: 'bills',
        pay_from_account_id: accounts[0]?.id || 'bank_acc',
        paid_for: activeProfile?.name || 'Personal',
        note: `Recurring: ${recurNameInput}`,
        is_scheduled: false
      });
    }

    setRecurAmountInput('');
    setRecurNameInput('');
    setSelectedRecurring(null);
  };

  return (
    <div className="pb-24 pt-4 px-4 bg-[#F8FAFC]">
      {/* Top Banner Applet Brand Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-300 via-indigo-400 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 flex items-center gap-1.5">
              Good Morning {activeProfile?.name !== 'Personal' ? activeProfile?.name : ''}
              <motion.span animate={{ rotate: [0, 15, 0, 15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} className="inline-block">👋</motion.span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">Expense & Budget Tracking</p>
          </div>
        </div>

        {/* Database Sync Status Indicator */}
        <div 
          onClick={() => setTab('settings')}
          className={`cursor-pointer px-2.5 py-1 rounded-full flex items-center space-x-1.5 transition-all text-[10px] font-bold ${
            isSupabaseConnected 
              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          {isSupabaseConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>SUPABASE</span>
            </>
          ) : (
            <>
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>LOCAL SYNC</span>
            </>
          )}
        </div>
      </div>

      {/* Screen 11 Style Card: Total Balance Banner */}
      <div className="bg-gradient-to-tr from-indigo-700 via-indigo-800 to-indigo-950 rounded-3xl p-6 text-white shadow-[0_12px_24px_-8px_rgba(79,70,229,0.5)] mb-5 relative overflow-hidden">
        {/* Absolute mesh circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <p className="text-[11px] font-bold tracking-widest text-indigo-200/80 uppercase">Total Balance</p>
        <h2 className="text-4xl font-extrabold text-white mt-1 select-all">
          {currencySymbol}{totalCalculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>

        {/* Income / Expense bar */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-indigo-600/50">
          <div className="flex items-center space-x-2.5 text-indigo-50">
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-200/80 font-bold uppercase tracking-wider">Income</p>
              <p className="text-[15px] font-bold font-mono">
                {currencySymbol}{totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 text-indigo-50 border-l border-indigo-600/50 pl-4">
            <div className="w-8 h-8 rounded-full bg-rose-500/25 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-200/80 font-bold uppercase tracking-wider">Expense</p>
              <p className="text-[15px] font-bold font-mono">
                {currencySymbol}{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spend Pulse Activation Block */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-5 flex items-start space-x-3.5">
        <div className="mt-1 w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0 animate-pulse">
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Spend Pulse</p>
          {settings.monthlyIncome > 0 ? (
            <div>
              <p className="text-slate-700 text-xs mt-0.5">
                Current spending speed is <strong>{savingsPercent > 40 ? 'Exceptional' : 'Normal'}</strong>.
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full transition-all ${savingsPercent > 50 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${Math.min(100, Math.max(10, Math.round((totalExpense / settings.monthlyIncome) * 100)))}%` }}
                />
              </div>
            </div>
          ) : (
            <button 
              id="btn_activate_pulse"
              onClick={() => setTab('settings')}
              className="text-[#64748B] hover:text-indigo-600 text-[11px] font-semibold mt-0.5 text-left flex items-center transition-colors"
            >
              Set your monthly income in Settings to activate Spend Pulse
              <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Screen 1 Streak + Health Score Side-by-side Cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* No Spend Streak */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <button 
              onClick={handleIncrementChallenge}
              className="text-[10px] font-bold text-indigo-600 hover:underline bg-indigo-50 px-2 py-0.5 rounded"
            >
              + Log
            </button>
          </div>
          <span className="block text-3xl font-extrabold text-slate-800">{getNoSpendStreak()}</span>
          <p className="text-[11px] font-bold text-slate-500 mt-0.5">No-Spend Streak</p>
          <span className="text-[9px] text-slate-400 block mt-1">Best: {getNoSpendStreak()} days</span>
        </div>

        {/* Health Score */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-3">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <span className="block text-3xl font-extrabold text-slate-800">{healthScore}</span>
          <p className="text-[11px] font-bold text-slate-500 mt-0.5">Health Score</p>
          <span className={`text-[9px] font-bold block mt-1 uppercase ${healthColor}`}>
            {healthLabel}
          </span>
        </div>
      </div>

      {/* Active Challenge Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-5 hover:shadow-md transition-shadow relative">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-[#64748B]">Active Challenge</p>
              <h4 className="text-sm font-bold text-slate-800">{challenge.title}</h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-orange-500 block">🔥 {challenge.streak}</span>
            <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Streak</span>
          </div>
        </div>

        {/* Progress statistics */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 my-3">
          <div 
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${(challenge.current / challenge.total) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-semibold text-[#8E9CAE]">
          <span>{challenge.current}/{challenge.total} days</span>
          <button 
            id="btn_complete_day"
            onClick={handleIncrementChallenge}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline"
          >
            Mark Day Complete
            <ArrowRight className="w-3 h-3" />
          </button>
          <span>{challenge.daysLeft}d left</span>
        </div>
      </div>

      {/* 3 Pill Metrics Panel */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center">
        <div className="bg-white rounded-xl py-3 px-1 border border-slate-50 shadow-sm">
          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
            Daily Avg
          </p>
          <span className="block text-xs font-black text-slate-800 mt-1">
            {currencySymbol}{dailyAverageExpenses.toFixed(2)}
          </span>
        </div>

        <div className="bg-white rounded-xl py-3 px-1 border border-slate-50 shadow-sm">
          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Savings
          </p>
          <span className="block text-xs font-black text-slate-800 mt-1">
            {savingsPercent}%
          </span>
        </div>

        <div className="bg-white rounded-xl py-3 px-1 border border-slate-50 shadow-sm">
          <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-800 inline-block" />
            Txns
          </p>
          <span className="block text-xs font-black text-slate-800 mt-1">
            {transactions.length}
          </span>
        </div>
      </div>

      {/* Accounts Headers & Action Button */}
      <div className="flex items-center justify-between mb-3 mt-1">
        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center space-x-1.5">
          <Building className="w-3.5 h-3.5" />
          <span>Accounts</span>
        </p>

        <button 
          id="btn_add_account_trigger"
          onClick={() => setShowAddAccountModal(true)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Account
        </button>
      </div>

      {/* Accounts display card list */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {accounts.map(acc => (
          <div 
            key={acc.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8.5 h-8.5 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 mb-2.5">
                {acc.type === 'bank' ? <Building className="w-4.5 h-4.5" /> : <CreditCard className="w-4.5 h-4.5" />}
              </div>
              <p className="text-xs font-bold text-[#64748B] truncate max-w-[130px]">{acc.name}</p>
            </div>
            <p className="text-lg font-black text-slate-800 mt-3 font-mono">
              {currencySymbol}{acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* RECURRING (grid of 6 cards matching screen images perfectly) */}
      <div className="mb-4">
        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center space-x-1.5 mb-3">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>RECURRING</span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          {recurringItems.map(item => {
            // Pick icon and color setup dynamically based on model type
            let iconElement = <CalendarDays className="w-5 h-5" />;
            let bgCircle = 'bg-blue-50 text-blue-500';

            switch (item.type) {
              case 'subscription': 
                iconElement = <CalendarDays className="w-5 h-5" />;
                bgCircle = 'bg-purple-50 text-purple-600';
                break;
              case 'fixed':
                iconElement = <Lock className="w-5 h-5" />;
                bgCircle = 'bg-emerald-50 text-emerald-600';
                break;
              case 'split':
                iconElement = <Users className="w-5 h-5" />;
                bgCircle = 'bg-indigo-50 text-indigo-500';
                break;
              case 'wishlist':
                iconElement = <Star className="w-5 h-5" />;
                bgCircle = 'bg-rose-50 text-rose-500';
                break;
              case 'ghost':
                iconElement = <Ghost className="w-5 h-5" />;
                bgCircle = 'bg-slate-100 text-purple-800';
                break;
              case 'debt':
                iconElement = <Activity className="w-5 h-5" />;
                bgCircle = 'bg-orange-50 text-orange-500';
                break;
            }

            return (
              <div 
                key={item.id}
                onClick={() => setSelectedRecurring(item.id)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-indigo-100 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl ${bgCircle} flex items-center justify-center`}>
                    {iconElement}
                  </div>
                  <span className="text-xl font-extrabold text-slate-800">{item.count}</span>
                </div>
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-slate-800">{item.name}</h5>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Add Account Modal */}
      <AnimatePresence>
        {showAddAccountModal && (
          <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between border-b pb-2">
                <span>Add New Account</span>
                <button 
                  onClick={() => setShowAddAccountModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >✕</button>
              </h3>

              <form onSubmit={handleAddNewAccount} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Account Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bank Account Rana"
                    required
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Opening Balance</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">Account Type</label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button 
                      type="button"
                      onClick={() => setNewAccType('bank')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        newAccType === 'bank' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Building className="w-4 h-4" /> Bank Account
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewAccType('credit')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        newAccType === 'credit' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit Card
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-950 font-bold hover:bg-neutral-900 border border-neutral-900 text-white py-2.5 rounded-xl text-xs transition shadow-md mt-2"
                >
                  Create Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Setup/Log Recurring modal */}
      <AnimatePresence>
        {selectedRecurring && (
          <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-base font-extrabold text-slate-800 mb-2 flex items-center justify-between border-b pb-2">
                <span>Configure {recurringItems.find(r => r.id === selectedRecurring)?.name}</span>
                <button 
                  onClick={() => setSelectedRecurring(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >✕</button>
              </h3>

              <p className="text-[10px] text-slate-400 font-semibold mb-4">
                This adds a logged recurring entry inside our tracked state and adds an automatic transaction expense logged into your account.
              </p>

              <form onSubmit={handleAddRecurringDetail} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Item Title / Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Netflix, Wifi, Rent split"
                    required
                    value={recurNameInput}
                    onChange={(e) => setRecurNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Amount</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={recurAmountInput}
                    onChange={(e) => setRecurAmountInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      // Simulates quick template setup
                      setRecurNameInput('Netflix Sub');
                      setRecurAmountInput('15.49');
                    }}
                    className="bg-indigo-50 text-indigo-700 py-2 rounded-xl text-[10px] font-bold transition hover:bg-indigo-100"
                  >
                    Load Netflix Template
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setRecurNameInput('Rent Split');
                      setRecurAmountInput('420.00');
                    }}
                    className="bg-indigo-50 text-indigo-700 py-2 rounded-xl text-[10px] font-bold transition hover:bg-indigo-100"
                  >
                    Load Rent Split
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-950 font-bold hover:bg-neutral-900 text-white py-2.5 rounded-xl text-xs transition shadow-md mt-2"
                >
                  Confirm Recurring Log
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default HomeView;

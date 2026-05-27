import React, { useState } from 'react';
import { useData } from '../lib/dataContext';
import { INITIAL_CATEGORIES } from '../lib/mockData';
import { Category } from '../types';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Plus, 
  CircleDot, 
  UserPlus, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface AddTransactionViewProps {
  onClose: () => void;
}

export const AddTransactionView: React.FC<AddTransactionViewProps> = ({ onClose }) => {
  const { 
    accounts, 
    profiles, 
    addTransaction, 
    getCurrencySymbol,
    addProfile,
    selectProfile,
    activeProfile
  } = useData();

  // Basic fields state
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('bills');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || 'bank_acc');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txNote, setTxNote] = useState('');
  const [paidFor, setPaidFor] = useState(activeProfile?.name || 'Personal');
  
  // Toggles
  const [isScheduled, setIsScheduled] = useState(false);
  const [payFromAccActive, setPayFromAccActive] = useState(true);

  // Profile overlay state
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileNameInput, setNewProfileNameInput] = useState('');

  const currencySymbol = getCurrencySymbol();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      alert('Please enter a valid transfer amount.');
      return;
    }

    await addTransaction({
      amount: parseFloat(expenseAmount),
      type: txType,
      date: txDate,
      category: selectedCategory,
      pay_from_account_id: payFromAccActive ? selectedAccount : 'cash',
      paid_for: paidFor,
      note: txNote,
      is_scheduled: isScheduled
    });

    // Close view
    onClose();
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileNameInput) return;
    
    await addProfile(newProfileNameInput);
    setPaidFor(newProfileNameInput);
    setNewProfileNameInput('');
    setShowAddProfileModal(false);
  };

  return (
    <div className="pb-28 pt-4 px-4 bg-[#F8FAFC] min-h-screen">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5">
        <button 
          id="btn_cancel_tx"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-800 font-bold bg-white px-3 py-1.5 rounded-full border border-slate-100"
        >
          Cancel
        </button>
        <h2 className="text-base font-extrabold text-slate-800">Add Transaction</h2>
        <div className="w-14" /> {/* spacer */}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Type Toggle: Expense / Income */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl grid grid-cols-2 gap-2 border border-slate-100">
          <button 
            type="button"
            id="toggle_expense"
            onClick={() => setTxType('expense')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              txType === 'expense' 
                ? 'bg-rose-500 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700 font-bold'
            }`}
          >
            <span>Expense</span>
          </button>
          
          <button 
            type="button"
            id="toggle_income"
            onClick={() => setTxType('income')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              txType === 'income' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700 font-bold'
            }`}
          >
            <span>Income</span>
          </button>
        </div>

        {/* Large Styled Amount Container */}
        <div className={`p-6 rounded-3xl border text-center transition-colors ${
          txType === 'expense' 
            ? 'bg-rose-50/50 border-rose-100/60' 
            : 'bg-emerald-50/50 border-emerald-100/60'
        }`}>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</p>
          <div className="mt-2.5 flex items-center justify-center space-x-1">
            <span className={`text-4xl font-extrabold ${
              txType === 'expense' ? 'text-rose-500' : 'text-emerald-500'
            }`}>{currencySymbol}</span>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00"
              required
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className={`text-4xl font-extrabold focus:outline-none w-56 text-center bg-transparent border-b border-transparent focus:border-indigo-100 font-mono ${
                txType === 'expense' ? 'text-rose-500' : 'text-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Form Interactive Item List */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-4">
          
          {/* 1. Date selector element */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Date</span>
                <span className="text-[10px] text-slate-400 font-semibold">Change transaction date</span>
              </div>
            </div>
            <input 
              type="date"
              required
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              className="text-xs font-bold text-indigo-600 bg-indigo-50/40 border border-indigo-50 rounded-lg px-2.5 py-1 focus:outline-none"
            />
          </div>

          {/* 2. Schedule Toggle element */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Schedule for Later</span>
                <span className="text-[10px] text-slate-400 font-semibold text-left block">Plan a future expense</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsScheduled(!isScheduled)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isScheduled ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
              }`}
            >
              <CircleDot className={`w-4- h-4 text-white ${isScheduled ? 'scale-100' : 'scale-0'}`} />
            </button>
          </div>

          {/* 3. Account select element */}
          <div className="flex flex-col space-y-2 pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-700">Pay from Account</span>
                  <span className="text-[10px] text-slate-400 font-semibold text-left block">Select a bank or card to track</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setPayFromAccActive(!payFromAccActive)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  payFromAccActive ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-white'
                }`}
              >
                <CircleDot className={`w-4 h-4 text-white ${payFromAccActive ? 'scale-100' : 'scale-0'}`} />
              </button>
            </div>

            {payFromAccActive && (
              <div className="pl-11 pt-1.5">
                <select 
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="bg-transparent text-xs font-bold text-sky-600 focus:outline-none border-b border-sky-200 pb-1 w-full max-w-xs"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({currencySymbol}{acc.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Profiles Pill selector (PAID FOR) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Paid For</span>
            <button 
              type="button" 
              onClick={() => setShowAddProfileModal(true)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 hover:underline"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profiles.map(p => (
              <button 
                key={p.id}
                type="button"
                onClick={() => {
                  setPaidFor(p.name);
                  selectProfile(p.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  paidFor === p.name 
                    ? 'bg-indigo-600 text-white shadow-sm scale-102' 
                    : 'bg-white border border-slate-100 text-[#475569] hover:bg-slate-50'
                }`}
              >
                👤 {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Screen 6 Circular Categories grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Category</span>
            <span className="text-indigo-500 font-bold">Grid Picker</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm grid grid-cols-3 gap-y-5 gap-x-4">
            {INITIAL_CATEGORIES.map((cat: Category) => {
              const isSelected = selectedCategory === cat.id;
              
              return (
                <button 
                  key={cat.id}
                  type="button"
                  id={`cat_btn_${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-center justify-center focus:outline-none transition group"
                >
                  {/* Category bubble wrapper */}
                  <div className={`w-13 h-13 rounded-full flex items-center justify-center text-xl transition-all ${cat.bg} ${
                    isSelected 
                      ? 'ring-4 ring-indigo-600 ring-offset-2 scale-105 shadow-md' 
                      : 'group-hover:scale-102 hover:shadow-xs'
                  }`}>
                    {/* Display first letter inside bubble */}
                    <span className={`font-black ${cat.color}`}>{cat.name[0]}</span>
                  </div>

                  <span className={`text-[10px] font-bold mt-2 tracking-wide font-sans text-center transition ${
                    isSelected ? 'text-indigo-600 font-extrabold' : 'text-slate-500'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note section */}
        <div>
          <span className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5">Note</span>
          <textarea 
            placeholder="Add structured tag notes or descriptions..."
            value={txNote}
            onChange={(e) => setTxNote(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-sm h-18 resize-none"
          />
        </div>

        {/* Submit button bar */}
        <button 
          id="btn_submit_transaction"
          type="submit"
          className="w-full py-3 bg-indigo-950 font-black hover:bg-neutral-900 border border-neutral-900 text-white rounded-2xl text-xs transition duration-200 shadow-lg tracking-widest uppercase hover:scale-[1.01]"
        >
          Add {txType}
        </button>
      </form>

      {/* Profile quick addition modal popup dialog */}
      {showAddProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowAddProfileModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-slate-800 mb-3.5">Add Profile</h3>
            <form onSubmit={handleCreateProfile} className="space-y-3">
              <input 
                type="text" 
                placeholder="Profile Name (e.g. Rana)"
                required
                value={newProfileNameInput}
                onChange={(e) => setNewProfileNameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-900 text-white font-bold py-2 rounded-xl text-xs hover:bg-indigo-950 transition"
              >
                Add Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddTransactionView;

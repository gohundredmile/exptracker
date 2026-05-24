import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon, Sun, LogOut, ChevronRight, Wallet, CreditCard,
  Building, Plus, Trash2, Edit, Download, Info, Bell,
  Globe, Target, X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { formatCurrency, transactionsToCSV, downloadCSV, getCurrentMonth } from '../lib/helpers';
import { CURRENCIES } from '../constants/currencies';
import type { Account } from '../types';

// Account Form Modal
const AccountFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  editAccount?: Account | null;
}> = ({ isOpen, onClose, editAccount }) => {
  const { addAccount, updateAccount } = useAppStore();
  const [name, setName] = useState(editAccount?.name ?? '');
  const [type, setType] = useState<Account['type']>(editAccount?.type ?? 'cash');
  const [balance, setBalance] = useState(editAccount?.balance?.toString() ?? '0');
  const [icon, setIcon] = useState(editAccount?.icon ?? '👛');
  const color = editAccount?.color ?? '#6C63FF';

  const accountIcons = ['👛', '🏦', '💳', '💵', '💰', '🏧', '📊', '💼'];
  const accountTypes: Account['type'][] = ['cash', 'bank', 'card'];

  const handleSave = () => {
    const data = { name, type, balance: parseFloat(balance) || 0, icon, color, is_default: false };
    if (editAccount) {
      updateAccount(editAccount.id, data);
    } else {
      addAccount(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editAccount ? 'Edit Account' : 'Add Account'} slideUp>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Icon</p>
          <div className="flex gap-2 flex-wrap">
            {accountIcons.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${icon === ic ? 'border-[#6C63FF] bg-purple-50 dark:bg-purple-900/20' : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Account name"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Type</p>
          <div className="flex gap-2">
            {accountTypes.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${type === t ? 'bg-[#6C63FF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Current Balance</label>
          <input
            type="number"
            value={balance}
            onChange={e => setBalance(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <Button fullWidth onClick={handleSave} size="lg">
          {editAccount ? 'Update Account' : 'Add Account'}
        </Button>
      </div>
    </Modal>
  );
};

// Budget Form Modal
const BudgetFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { budgets, categories, addBudget, updateBudget, deleteBudget } = useAppStore();
  const [selectedCatId, setSelectedCatId] = useState(1);
  const [amount, setAmount] = useState('');
  const month = getCurrentMonth();

  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');
  const existingBudget = budgets.find(b => b.category_id === selectedCatId && b.month === month);

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const data = { category_id: selectedCatId, amount: parseFloat(amount), month };
    if (existingBudget) {
      updateBudget(existingBudget.id, { amount: parseFloat(amount) });
    } else {
      addBudget(data);
    }
    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Budget" slideUp>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Category</p>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {expenseCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCatId(cat.id);
                  const existing = budgets.find(b => b.category_id === cat.id && b.month === month);
                  setAmount(existing?.amount?.toString() ?? '');
                }}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl shrink-0 min-w-[70px] border-2 transition-all ${
                  selectedCatId === cat.id
                    ? 'border-[#6C63FF] bg-purple-50 dark:bg-purple-900/20'
                    : 'border-transparent bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-center">{cat.name.length > 8 ? cat.name.slice(0, 8) + '…' : cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">
            Budget Amount {existingBudget ? '(updating existing)' : ''}
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        {/* Existing budgets */}
        {budgets.filter(b => b.month === month).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Current Budgets</p>
            <div className="space-y-2">
              {budgets.filter(b => b.month === month).map(budget => {
                const cat = categories.find(c => c.id === budget.category_id);
                return (
                  <div key={budget.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                    <span className="text-sm">{cat?.icon} {cat?.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">${budget.amount}</span>
                      <button onClick={() => deleteBudget(budget.id)} className="text-red-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button fullWidth onClick={handleSave} size="lg">
          {existingBudget ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </Modal>
  );
};

// Profile Edit Modal
const ProfileEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = useState(profile.full_name);
  const [currency, setCurrency] = useState(profile.currency);
  const [budget, setBudget] = useState(profile.monthly_budget.toString());

  const handleSave = () => {
    updateProfile({
      full_name: name,
      currency,
      monthly_budget: parseFloat(budget) || 0,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" slideUp>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Full Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Currency</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5">Monthly Budget</label>
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />
        </div>

        <Button fullWidth onClick={handleSave} size="lg">Save Changes</Button>
      </div>
    </Modal>
  );
};

// Account type icon
const accountTypeIcon = (type: Account['type']) => {
  if (type === 'cash') return <Wallet className="w-4 h-4" />;
  if (type === 'bank') return <Building className="w-4 h-4" />;
  return <CreditCard className="w-4 h-4" />;
};

export const Profile: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { profile, accounts, transactions, darkMode, toggleDarkMode, deleteAccount } = useAppStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [showBudget, setShowBudget] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const handleExportAll = () => {
    const csv = transactionsToCSV(transactions);
    downloadCSV(csv, `wealthwise-all-transactions.csv`);
  };

  const SettingsRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    subtitle?: string;
    onClick?: () => void;
    rightContent?: React.ReactNode;
    danger?: boolean;
  }> = ({ icon, label, subtitle, onClick, rightContent, danger = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3.5 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}
    >
      <div className={`shrink-0 ${danger ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>{icon}</div>
      <div className="flex-1 text-left">
        <p className={`text-sm font-medium ${danger ? 'text-red-500' : ''}`}>{label}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
      </div>
      {rightContent ?? <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FF] dark:bg-[#1A1A2E] overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Profile</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] rounded-3xl p-5 text-white"
        >
          <div className="flex items-center gap-4">
            <Avatar name={profile.full_name} imageUrl={profile.avatar_url} size="xl" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-white/70 text-sm mt-0.5">Premium Member</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Globe className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/80 text-xs">{profile.currency}</span>
              </div>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-white/60 text-xs">Balance</p>
              <p className="text-white font-bold text-sm mt-0.5">{formatCurrency(totalBalance, profile.currency)}</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-white/60 text-xs">Transactions</p>
              <p className="text-white font-bold text-sm mt-0.5">{transactions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs">Budget</p>
              <p className="text-white font-bold text-sm mt-0.5">{formatCurrency(profile.monthly_budget, profile.currency)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accounts Section */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">My Accounts</h3>
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-1.5 text-[#6C63FF] text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {accounts.map(acc => (
            <motion.div
              key={acc.id}
              className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${acc.color}20` }}
              >
                {acc.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{acc.name}</p>
                  <div className="flex items-center gap-0.5 text-gray-400 dark:text-gray-500">
                    {accountTypeIcon(acc.type)}
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{acc.type} Account</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${acc.balance >= 0 ? 'text-[#00C897]' : 'text-[#FF6B6B]'}`}>
                  {formatCurrency(acc.balance, profile.currency)}
                </p>
                <div className="flex gap-1 mt-1 justify-end">
                  <button onClick={() => setEditAccount(acc)} className="text-blue-400 hover:text-blue-600">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {accounts.length > 1 && (
                    <button onClick={() => deleteAccount(acc.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-5 space-y-3">
        {/* Finance Settings */}
        <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Finance</p>
          </div>
          <SettingsRow
            icon={<Target className="w-5 h-5" />}
            label="Monthly Budget Settings"
            subtitle={`Current: ${formatCurrency(profile.monthly_budget, profile.currency)}`}
            onClick={() => setShowBudget(true)}
          />
          <div className="h-px bg-gray-50 dark:bg-gray-800 mx-4" />
          <SettingsRow
            icon={<Globe className="w-5 h-5" />}
            label="Currency"
            subtitle={`${profile.currency}`}
            onClick={() => setShowEditProfile(true)}
          />
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Preferences</p>
          </div>
          <SettingsRow
            icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            label="Dark Mode"
            onClick={toggleDarkMode}
            rightContent={
              <div
                onClick={(e) => { e.stopPropagation(); toggleDarkMode(); }}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${darkMode ? 'bg-[#6C63FF]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
              </div>
            }
          />
          <div className="h-px bg-gray-50 dark:bg-gray-800 mx-4" />
          <SettingsRow
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            subtitle="Budget alerts & reminders"
          />
        </div>

        {/* Data */}
        <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Data</p>
          </div>
          <SettingsRow
            icon={<Download className="w-5 h-5" />}
            label="Export All Data"
            subtitle="Download CSV file"
            onClick={handleExportAll}
          />
        </div>

        {/* About */}
        <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">About</p>
          </div>
          <SettingsRow
            icon={<Info className="w-5 h-5" />}
            label="WealthWise"
            subtitle="Version 1.0.0 • Take control of your money"
          />
        </div>

        {/* Logout */}
        <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
          <SettingsRow
            icon={<LogOut className="w-5 h-5" />}
            label="Log Out"
            onClick={() => setShowLogoutConfirm(true)}
            danger
            rightContent={null}
          />
        </div>
      </div>

      {/* Logout Confirm */}
      <Modal isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} size="sm">
        <div className="p-6 text-center">
          <div className="text-5xl mb-3">👋</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Log Out?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Your data will be saved locally. You can log back in anytime.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={onLogout}>Log Out</Button>
          </div>
        </div>
      </Modal>

      {/* Modals */}
      <ProfileEditModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <AccountFormModal
        isOpen={showAddAccount || editAccount !== null}
        onClose={() => { setShowAddAccount(false); setEditAccount(null); }}
        editAccount={editAccount}
      />
      <BudgetFormModal isOpen={showBudget} onClose={() => setShowBudget(false)} />
    </div>
  );
};

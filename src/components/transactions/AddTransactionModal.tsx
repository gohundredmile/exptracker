import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, AlignLeft, RefreshCw, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { format } from 'date-fns';
import type { Transaction } from '../../types';

type TransactionType = 'expense' | 'income' | 'transfer';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

const TYPE_TABS: { value: TransactionType; label: string; color: string }[] = [
  { value: 'expense', label: 'Expense', color: '#FF6B6B' },
  { value: 'income', label: 'Income', color: '#00C897' },
  { value: 'transfer', label: 'Transfer', color: '#F7B731' },
];

// Numpad component
const NumPad: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const handleKey = (key: string) => {
    if (key === 'backspace') {
      onChange(value.length <= 1 ? '0' : value.slice(0, -1));
      return;
    }
    if (key === '.' && value.includes('.')) return;
    const parts = value.split('.');
    if (parts[1]?.length >= 2) return;
    if (value === '0' && key !== '.') {
      onChange(key);
      return;
    }
    onChange(value + key);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map(key => (
        <motion.button
          key={key}
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => handleKey(key)}
          className={`h-14 rounded-2xl font-semibold text-xl flex items-center justify-center transition-all ${
            key === 'backspace'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {key === 'backspace' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : key}
        </motion.button>
      ))}
    </div>
  );
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen, onClose, editTransaction,
}) => {
  const { accounts, categories, addTransaction, updateTransaction } = useAppStore();

  const defaultAccountId = editTransaction?.account_id
    ?? (accounts.find(a => a.is_default)?.id ?? accounts[0]?.id ?? '');

  const [activeType, setActiveType] = useState<TransactionType>(editTransaction?.type ?? 'expense');
  const [amountStr, setAmountStr] = useState(editTransaction?.amount?.toString() ?? '0');
  const [showNumpad, setShowNumpad] = useState(true);
  const [title, setTitle] = useState(editTransaction?.title ?? '');
  const [categoryId, setCategoryId] = useState(editTransaction?.category_id ?? 1);
  const [accountId, setAccountId] = useState(defaultAccountId);
  const [transferToId, setTransferToId] = useState(editTransaction?.transfer_to_account_id ?? '');
  const [date, setDate] = useState(editTransaction?.date ?? format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState(editTransaction?.note ?? '');
  const [isRecurring, setIsRecurring] = useState(editTransaction?.is_recurring ?? false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    editTransaction?.recurring_interval ?? 'monthly'
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter(c =>
    c.type === activeType || c.type === 'both'
  );

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type);
    const firstCat = categories.find(c => c.type === type || c.type === 'both');
    if (firstCat) setCategoryId(firstCat.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);

    if (!title.trim()) { setError('Please enter a title'); return; }
    if (isNaN(amount) || amount <= 0) { setError('Please enter a valid amount'); return; }
    if (!accountId) { setError('Please select an account'); return; }
    if (activeType === 'transfer' && !transferToId) { setError('Please select a destination account'); return; }

    setLoading(true);
    setError('');

    try {
      const data = {
        title: title.trim(),
        amount,
        type: activeType,
        category_id: categoryId,
        account_id: accountId,
        date,
        note: note || null,
        receipt_url: null,
        is_recurring: isRecurring,
        recurring_interval: isRecurring ? recurringInterval : null,
        transfer_to_account_id: activeType === 'transfer' ? transferToId : null,
      };

      if (editTransaction) {
        updateTransaction(editTransaction.id, data);
      } else {
        addTransaction(data);
      }

      // Reset
      setAmountStr('0');
      setTitle('');
      setNote('');
      setActiveType('expense');
      setIsRecurring(false);
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typeConfig = TYPE_TABS.find(t => t.value === activeType)!;

  return (
    <Modal isOpen={isOpen} onClose={onClose} slideUp size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">
            {editTransaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 p-4 pb-0 shrink-0">
          {TYPE_TABS.map(tab => (
            <motion.button
              key={tab.value}
              type="button"
              onClick={() => handleTypeChange(tab.value)}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={activeType === tab.value
                ? { backgroundColor: tab.color, color: 'white' }
                : { backgroundColor: 'transparent', color: '#9CA3AF', border: '1px solid #E5E7EB' }
              }
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Amount Display */}
        <div className="text-center py-4 px-4 shrink-0">
          <div className="text-5xl font-bold" style={{ color: typeConfig.color }}>
            <span className="text-2xl font-normal text-gray-300 mr-1">
              {activeType === 'income' ? '+' : activeType === 'expense' ? '-' : '↔'}
            </span>
            {parseFloat(amountStr || '0').toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <button
            type="button"
            onClick={() => setShowNumpad(!showNumpad)}
            className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1 mx-auto"
          >
            {showNumpad ? 'Hide numpad' : 'Show numpad'}
            <ChevronDown className={`w-3 h-3 transition-transform ${showNumpad ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">
          {/* Numpad */}
          <AnimatePresence>
            {showNumpad && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <NumPad value={amountStr} onChange={setAmountStr} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Transaction title"
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          />

          {/* Category Picker */}
          {activeType !== 'transfer' && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Category</p>
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {filteredCategories.map(cat => (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl shrink-0 min-w-[70px] transition-all border-2 ${
                      categoryId === cat.id
                        ? 'border-[#6C63FF] bg-purple-50 dark:bg-purple-900/20'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs text-center leading-tight" style={{ maxWidth: 60 }}>
                      {cat.name.length > 8 ? cat.name.slice(0, 8) + '…' : cat.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Account Selector */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              {activeType === 'transfer' ? 'From Account' : 'Account'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {accounts.map(acc => (
                <motion.button
                  key={acc.id}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccountId(acc.id)}
                  className={`p-3 rounded-xl text-center border-2 transition-all ${
                    accountId === acc.id
                      ? 'border-[#6C63FF] bg-purple-50 dark:bg-purple-900/20'
                      : 'border-transparent bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <div className="text-xl mb-1">{acc.icon}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{acc.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Transfer To Account */}
          {activeType === 'transfer' && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">To Account</p>
              <div className="grid grid-cols-3 gap-2">
                {accounts.filter(a => a.id !== accountId).map(acc => (
                  <motion.button
                    key={acc.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTransferToId(acc.id)}
                    className={`p-3 rounded-xl text-center border-2 transition-all ${
                      transferToId === acc.id
                        ? 'border-[#F7B731] bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-transparent bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="text-xl mb-1">{acc.icon}</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{acc.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
            />
          </div>

          {/* Note */}
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
            <AlignLeft className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Recurring</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={e => setIsRecurring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-[#6C63FF] transition-colors relative">
                  <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform ${isRecurring ? 'translate-x-5' : ''}`} />
                </div>
              </label>
            </div>

            <AnimatePresence>
              {isRecurring && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-3 gap-2 mt-2"
                >
                  {(['daily', 'weekly', 'monthly'] as const).map(interval => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => setRecurringInterval(interval)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                        recurringInterval === interval
                          ? 'bg-[#6C63FF] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={parseFloat(amountStr) <= 0}
            size="lg"
          >
            {editTransaction ? 'Update Transaction' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Trash2, Edit, ChevronDown, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate, transactionsToCSV, downloadCSV, getCurrentMonth } from '../lib/helpers';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import type { Transaction, FilterOptions } from '../types';

export const Transactions: React.FC = () => {
  const { profile, categories, filterOptions, setFilterOptions } = useAppStore();
  const { transactions, deleteTransaction, search } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const displayedTransactions = useMemo(() => {
    let result = searchQuery ? search(searchQuery) : transactions;

    // Apply type filter
    if (filterOptions.type !== 'all') {
      result = result.filter(t => t.type === filterOptions.type);
    }
    if (filterOptions.category_id !== null) {
      result = result.filter(t => t.category_id === filterOptions.category_id);
    }
    if (filterOptions.account_id !== null) {
      result = result.filter(t => t.account_id === filterOptions.account_id);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (filterOptions.sort_by === 'amount') {
        return filterOptions.sort_order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      const cmp = b.date.localeCompare(a.date);
      return filterOptions.sort_order === 'desc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, searchQuery, filterOptions, search]);

  // Group by date
  const grouped = useMemo(() => {
    const paginated = displayedTransactions.slice(0, page * PAGE_SIZE);
    const groups = new Map<string, Transaction[]>();
    paginated.forEach(t => {
      const existing = groups.get(t.date) ?? [];
      groups.set(t.date, [...existing, t]);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [displayedTransactions, page]);

  const handleExport = () => {
    const csv = transactionsToCSV(displayedTransactions);
    downloadCSV(csv, `wealthwise-transactions-${getCurrentMonth()}.csv`);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTransaction(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const resetFilters = () => {
    setFilterOptions({
      type: 'all',
      category_id: null,
      account_id: null,
      date_from: null,
      date_to: null,
      sort_by: 'date',
      sort_order: 'desc',
    });
    setShowFilter(false);
  };

  const activeFilterCount = [
    filterOptions.type !== 'all',
    filterOptions.category_id !== null,
    filterOptions.account_id !== null,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FF] dark:bg-[#1A1A2E]">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-[#F8F9FF] dark:bg-[#1A1A2E]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Transactions</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-white dark:bg-[#16213E] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search transactions..."
              className="w-full bg-white dark:bg-[#16213E] border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`relative flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              showFilter || activeFilterCount > 0
                ? 'bg-[#6C63FF] text-white'
                : 'bg-white dark:bg-[#16213E] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-white text-[#6C63FF] rounded-full text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 space-y-3">
                {/* Type Filter */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Type</p>
                  <div className="flex gap-2">
                    {(['all', 'income', 'expense', 'transfer'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterOptions({ type: t })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                          filterOptions.type === t
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sort by</p>
                  <div className="flex gap-2">
                    {[
                      { value: 'date', label: 'Date' },
                      { value: 'amount', label: 'Amount' },
                    ].map(s => (
                      <button
                        key={s.value}
                        onClick={() => setFilterOptions({ sort_by: s.value as FilterOptions['sort_by'] })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          filterOptions.sort_by === s.value
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setFilterOptions({
                        sort_order: filterOptions.sort_order === 'desc' ? 'asc' : 'desc',
                      })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1"
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform ${filterOptions.sort_order === 'asc' ? 'rotate-180' : ''}`} />
                      {filterOptions.sort_order === 'desc' ? 'Newest' : 'Oldest'}
                    </button>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Category</p>
                  <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    <button
                      onClick={() => setFilterOptions({ category_id: null })}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filterOptions.category_id === null
                          ? 'bg-[#6C63FF] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterOptions({ category_id: cat.id })}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          filterOptions.category_id === cat.id
                            ? 'bg-[#6C63FF] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-[#6C63FF] bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {displayedTransactions.length} transactions
        </p>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {searchQuery ? 'Try a different search' : 'Add your first transaction!'}
            </p>
          </div>
        ) : (
          <>
            {grouped.map(([date, txns]) => (
              <div key={date} className="mb-4">
                {/* Date Header */}
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {formatDate(date)}
                  </p>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                    {txns.length > 1 ? `${txns.length} items` : ''}
                  </p>
                </div>

                {/* Transaction Items */}
                <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {txns.map((transaction, idx) => (
                    <motion.div
                      key={transaction.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        idx !== 0 ? 'border-t border-gray-50 dark:border-gray-800/50' : ''
                      }`}
                    >
                      {/* Category Icon */}
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: `${transaction.category?.color ?? '#6C63FF'}15` }}
                      >
                        {transaction.category?.icon ?? '💸'}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                          {transaction.title}
                          {transaction.is_recurring && (
                            <span className="ml-1.5 text-xs text-[#6C63FF]">🔄</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {transaction.category?.name ?? 'Unknown'}
                          </span>
                          <span className="text-gray-200 dark:text-gray-700">•</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {transaction.account?.name ?? 'Unknown'}
                          </span>
                        </div>
                        {transaction.note && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                            📝 {transaction.note}
                          </p>
                        )}
                      </div>

                      {/* Amount & Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <p className={`text-sm font-bold ${
                          transaction.type === 'income' ? 'text-[#00C897]' :
                          transaction.type === 'expense' ? 'text-[#FF6B6B]' :
                          'text-[#F7B731]'
                        }`}>
                          {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                          {formatCurrency(transaction.amount, profile.currency)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditTransaction(transaction)}
                            className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              deleteConfirm === transaction.id
                                ? 'bg-red-500 text-white'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Load More */}
            {displayedTransactions.length > page * PAGE_SIZE && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full py-3 text-sm font-semibold text-[#6C63FF] bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Load more...
              </button>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <AddTransactionModal
        isOpen={editTransaction !== null}
        onClose={() => setEditTransaction(null)}
        editTransaction={editTransaction}
      />
    </div>
  );
};

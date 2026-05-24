import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

// ══════════════════════════════════════════════
// useTransactions Hook
// ══════════════════════════════════════════════

export const useTransactions = () => {
  const {
    transactions,
    accounts,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterOptions,
  } = useAppStore();

  // Enrich transactions with joined data
  const enrichedTransactions = useMemo(() => {
    return transactions.map(t => ({
      ...t,
      category: categories.find(c => c.id === t.category_id) ??
        DEFAULT_CATEGORIES.find(c => c.id === t.category_id),
      account: accounts.find(a => a.id === t.account_id),
    })) as Transaction[];
  }, [transactions, categories, accounts]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...enrichedTransactions];

    if (filterOptions.type !== 'all') {
      result = result.filter(t => t.type === filterOptions.type);
    }

    if (filterOptions.category_id !== null) {
      result = result.filter(t => t.category_id === filterOptions.category_id);
    }

    if (filterOptions.account_id !== null) {
      result = result.filter(t => t.account_id === filterOptions.account_id);
    }

    if (filterOptions.date_from) {
      result = result.filter(t => t.date >= filterOptions.date_from!);
    }

    if (filterOptions.date_to) {
      result = result.filter(t => t.date <= filterOptions.date_to!);
    }

    // Sort
    result.sort((a, b) => {
      if (filterOptions.sort_by === 'date') {
        const dateCompare = b.date.localeCompare(a.date);
        return filterOptions.sort_order === 'asc' ? -dateCompare : dateCompare;
      } else {
        const amountCompare = b.amount - a.amount;
        return filterOptions.sort_order === 'asc' ? -amountCompare : amountCompare;
      }
    });

    return result;
  }, [enrichedTransactions, filterOptions]);

  // Get transactions by month
  const getByMonth = (month: string) => {
    return enrichedTransactions.filter(t => t.date.startsWith(month));
  };

  // Get transactions by date range
  const getByDateRange = (from: string, to: string) => {
    return enrichedTransactions.filter(t => t.date >= from && t.date <= to);
  };

  // Monthly summary
  const getMonthlySummary = (month: string) => {
    const monthlyTxns = getByMonth(month);
    const income = monthlyTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthlyTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  };

  // Group by date
  const groupByDate = (txns: Transaction[]) => {
    const groups = new Map<string, Transaction[]>();
    txns.forEach(t => {
      const existing = groups.get(t.date) ?? [];
      groups.set(t.date, [...existing, t]);
    });
    return groups;
  };

  // Search
  const search = (query: string): Transaction[] => {
    if (!query.trim()) return enrichedTransactions;
    const q = query.toLowerCase();
    return enrichedTransactions.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        t.amount.toString().includes(q) ||
        t.category?.name.toLowerCase().includes(q)
    );
  };

  return {
    transactions: enrichedTransactions,
    filteredTransactions,
    getByMonth,
    getByDateRange,
    getMonthlySummary,
    groupByDate,
    search,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

// Spending by category for a given transaction set
export const useCategorySpending = (transactions: Transaction[]) => {
  return useMemo(() => {
    const spending = new Map<number, number>();
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = spending.get(t.category_id) ?? 0;
        spending.set(t.category_id, current + t.amount);
      });
    return spending;
  }, [transactions]);
};

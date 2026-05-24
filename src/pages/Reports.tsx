import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useTransactions } from '../hooks/useTransactions';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { IncomeExpenseBar } from '../components/charts/IncomeExpenseBar';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { formatCurrency, getDateRange } from '../lib/helpers';
import type { ReportPeriod } from '../types';

const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export const Reports: React.FC = () => {
  const { profile, categories, selectedMonth } = useAppStore();
  const { getByDateRange } = useTransactions();
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const dateRange = getDateRange(period);
  const periodTransactions = getByDateRange(dateRange.from, dateRange.to);

  const summary = useMemo(() => {
    const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [periodTransactions]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const spending = new Map<number, number>();
    const expenses = periodTransactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);

    expenses.forEach(t => {
      spending.set(t.category_id, (spending.get(t.category_id) ?? 0) + t.amount);
    });

    return Array.from(spending.entries())
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        return {
          category: cat,
          total: amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
          transactions: expenses.filter(t => t.category_id === catId).length,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [periodTransactions, categories]);

  // Biggest transactions
  const biggestTransactions = useMemo(() => {
    return [...periodTransactions]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [periodTransactions]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FF] dark:bg-[#1A1A2E]">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-[#F8F9FF] dark:bg-[#1A1A2E]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Reports</h1>

        {/* Period Selector */}
        <div className="flex gap-2 bg-white dark:bg-[#16213E] rounded-2xl p-1 border border-gray-100 dark:border-gray-800">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === opt.value
                  ? 'bg-[#6C63FF] text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#16213E] rounded-2xl p-3 border border-gray-100 dark:border-gray-800 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Income</p>
            <p className="text-sm font-bold text-[#00C897] truncate">{formatCurrency(summary.income, profile.currency)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#16213E] rounded-2xl p-3 border border-gray-100 dark:border-gray-800 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expense</p>
            <p className="text-sm font-bold text-[#FF6B6B] truncate">{formatCurrency(summary.expense, profile.currency)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#16213E] rounded-2xl p-3 border border-gray-100 dark:border-gray-800 text-center"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net</p>
            <p className={`text-sm font-bold truncate ${summary.net >= 0 ? 'text-[#00C897]' : 'text-[#FF6B6B]'}`}>
              {summary.net >= 0 ? '+' : ''}{formatCurrency(summary.net, profile.currency)}
            </p>
          </motion.div>
        </div>

        {/* Spending Pie Chart */}
        <SpendingPieChart month={period === 'month' ? selectedMonth : undefined} />

        {/* Income vs Expense Bar */}
        <IncomeExpenseBar />

        {/* Trend Line */}
        <TrendLineChart month={period === 'month' ? selectedMonth : undefined} />

        {/* Top Categories */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Top Spending Categories</h3>
            <div className="space-y-3">
              {categoryBreakdown.slice(0, 6).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl w-8 text-center shrink-0">{item.category?.icon ?? '📦'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.category?.name ?? 'Unknown'}
                      </span>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                        {formatCurrency(item.total, profile.currency)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.05 + 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.category?.color ?? '#6C63FF' }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {item.percentage.toFixed(1)}% • {item.transactions} transactions
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Biggest Transactions */}
        {biggestTransactions.length > 0 && (
          <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Biggest Transactions</h3>
            <div className="space-y-3">
              {biggestTransactions.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${t.category?.color ?? '#6C63FF'}15` }}
                  >
                    {t.category?.icon ?? '💸'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{t.date}</p>
                  </div>
                  <p className={`text-sm font-bold shrink-0 ${
                    t.type === 'income' ? 'text-[#00C897]' : 'text-[#FF6B6B]'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, profile.currency)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {periodTransactions.length === 0 && (
          <div className="bg-white dark:bg-[#16213E] rounded-2xl p-8 border border-gray-100 dark:border-gray-800 text-center">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No data for this period</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add some transactions to see your reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

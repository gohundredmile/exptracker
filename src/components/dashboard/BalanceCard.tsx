import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, getMonthLabel, getPreviousMonth, getNextMonth, getCurrentMonth } from '../../lib/helpers';
import { format } from 'date-fns';

// Animated counter component
const AnimatedNumber: React.FC<{ value: number; currency: string }> = ({ value, currency }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatCurrency(display, currency)}</span>;
};

export const BalanceCard: React.FC = () => {
  const { profile, accounts, selectedMonth, setSelectedMonth } = useAppStore();
  const { getMonthlySummary } = useTransactions();

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const { income, expense } = getMonthlySummary(selectedMonth);
  const currentMonth = getCurrentMonth();

  const handlePrevMonth = () => setSelectedMonth(getPreviousMonth(selectedMonth));
  const handleNextMonth = () => setSelectedMonth(getNextMonth(selectedMonth));

  const isCurrentMonth = selectedMonth === currentMonth;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] rounded-3xl p-5 text-white shadow-xl shadow-purple-200 dark:shadow-purple-900/40"
    >
      {/* Month Selector */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-white/90">
          {getMonthLabel(selectedMonth)}
        </span>
        <button
          onClick={handleNextMonth}
          disabled={isCurrentMonth}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Total Balance */}
      <div className="text-center mb-5">
        <p className="text-white/70 text-xs font-medium mb-1 uppercase tracking-widest">Total Balance</p>
        <h2 className="text-4xl font-bold tracking-tight">
          <AnimatedNumber value={totalBalance} currency={profile.currency} />
        </h2>
        <p className="text-white/60 text-xs mt-1">
          {format(new Date(), 'MMMM dd, yyyy')}
        </p>
      </div>

      {/* Income & Expense Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#00C897]/30 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-[#00C897]" />
            </div>
            <span className="text-white/70 text-xs font-medium">Income</span>
          </div>
          <p className="text-white font-bold text-lg">
            {formatCurrency(income, profile.currency)}
          </p>
        </div>
        <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-[#FF6B6B]/30 flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-[#FF6B6B]" />
            </div>
            <span className="text-white/70 text-xs font-medium">Expense</span>
          </div>
          <p className="text-white font-bold text-lg">
            {formatCurrency(expense, profile.currency)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

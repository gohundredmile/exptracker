import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, calculatePercentage } from '../../lib/helpers';

interface BudgetProgressProps {
  onViewAll?: () => void;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ onViewAll }) => {
  const { budgets, categories, profile, selectedMonth } = useAppStore();
  const { getByMonth } = useTransactions();

  const monthlyTransactions = getByMonth(selectedMonth);

  const budgetData = useMemo(() => {
    return budgets
      .filter(b => b.month === selectedMonth)
      .map(budget => {
        const category = categories.find(c => c.id === budget.category_id);
        const spent = monthlyTransactions
          .filter(t => t.type === 'expense' && t.category_id === budget.category_id)
          .reduce((sum, t) => sum + t.amount, 0);

        const percentage = calculatePercentage(spent, budget.amount);
        return { ...budget, category, spent, percentage };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [budgets, categories, selectedMonth, monthlyTransactions]);

  if (budgetData.length === 0) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">Budget Progress</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No budgets set for this month</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Set budgets in Profile settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Budget Progress</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-[#6C63FF] text-xs font-medium hover:underline"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {budgetData.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.category?.icon ?? '📦'}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {item.category?.name ?? 'Unknown'}
                </span>
                {item.percentage >= 80 && (
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                )}
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold ${
                  item.percentage >= 100 ? 'text-red-500' :
                  item.percentage >= 80 ? 'text-orange-500' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatCurrency(item.spent, profile.currency)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  /{formatCurrency(item.amount, profile.currency)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 + 0.2 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: item.percentage >= 100 ? '#FF6B6B' :
                    item.percentage >= 80 ? '#F7B731' :
                    item.category?.color ?? '#6C63FF',
                }}
              />
            </div>

            <div className="flex justify-between mt-0.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatCurrency(Math.max(0, item.amount - item.spent), profile.currency)} left
              </span>
              <span className={`text-xs font-medium ${
                item.percentage >= 100 ? 'text-red-500' :
                item.percentage >= 80 ? 'text-orange-500' :
                'text-gray-400 dark:text-gray-500'
              }`}>
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

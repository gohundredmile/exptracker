import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency, formatDate } from '../../lib/helpers';


interface RecentTransactionsProps {
  onViewAll?: () => void;
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  onViewAll,
  limit = 5,
}) => {
  const { profile, selectedMonth } = useAppStore();
  const { getByMonth } = useTransactions();

  const recentTransactions = getByMonth(selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">💸</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions this month</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Add your first transaction!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#16213E] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-[#6C63FF] text-xs font-medium hover:underline"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {transaction.category?.name ?? 'Unknown'}
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDate(transaction.date)}
                </span>
                {transaction.is_recurring && (
                  <>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-[#6C63FF]">🔄</span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className={`text-sm font-bold ${
                transaction.type === 'income' ? 'text-[#00C897]' :
                transaction.type === 'expense' ? 'text-[#FF6B6B]' :
                'text-[#F7B731]'
              }`}>
                {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                {formatCurrency(transaction.amount, profile.currency)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {transaction.account?.name ?? 'Unknown'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

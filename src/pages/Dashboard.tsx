import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { BudgetProgress } from '../components/dashboard/BudgetProgress';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { SpendingPieChart } from '../components/charts/SpendingPieChart';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { getGreeting } from '../lib/helpers';
import { Avatar } from '../components/ui/Avatar';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const { profile, budgets, selectedMonth } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Budget alerts (>= 80% used)
  const alerts = budgets.filter(b => {
    if (b.month !== selectedMonth) return false;
    return (b.spent / b.amount) >= 0.8;
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FF] dark:bg-[#1A1A2E]">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 bg-[#F8F9FF] dark:bg-[#1A1A2E]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {getGreeting()} 👋
            </p>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {profile.full_name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full bg-white dark:bg-[#16213E] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
            <Avatar name={profile.full_name} imageUrl={profile.avatar_url} size="md" />
          </div>
        </div>

        {/* Budget Alert Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-3 flex items-center gap-3"
          >
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Budget Alert</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {alerts.length} {alerts.length === 1 ? 'category is' : 'categories are'} nearing their limit
              </p>
            </div>
            <button
              onClick={() => onTabChange('profile')}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 underline"
            >
              View
            </button>
          </motion.div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* Balance Card */}
        <BalanceCard />

        {/* Spending Chart */}
        <SpendingPieChart />

        {/* Budget Progress */}
        <BudgetProgress onViewAll={() => onTabChange('profile')} />

        {/* Recent Transactions */}
        <RecentTransactions
          onViewAll={() => onTabChange('transactions')}
          limit={6}
        />

        {/* Quick Add FAB for mobile */}
        <div className="h-4" />
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-[#6C63FF] to-[#9F97FF] rounded-2xl shadow-xl shadow-purple-300 dark:shadow-purple-900/50 flex items-center justify-center z-20"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

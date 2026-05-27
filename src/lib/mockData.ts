import { Category, Account, RecurringItem, Challenge, UserSettings, Profile } from '../types';

export const INITIAL_PROFILES: Profile[] = [
  { id: '1', name: 'Personal', is_default: true },
  { id: '2', name: 'Rana', is_default: false }
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'bank_acc', name: 'Bank Account', balance: 0.00, type: 'bank', icon: 'Building' },
  { id: 'credit_card', name: 'Credit Card', balance: 0.00, type: 'credit', icon: 'CreditCard' }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'alcohol', name: 'Alcohol', icon: 'GlassWater', color: 'text-amber-700', bg: 'bg-amber-50' },
  { id: 'beauty', name: 'Beauty', icon: 'Scissors', color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'bills', name: 'Bills', icon: 'FileText', color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'car', name: 'Car', icon: 'Car', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'cigarettes', name: 'Cigarettes', icon: 'FlameKindling', color: 'text-amber-900', bg: 'bg-orange-50' },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'donations', name: 'Donations', icon: 'Heart', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'electronics', name: 'Electronics', icon: 'Tv', color: 'text-cyan-600', bg: 'bg-cyan-50' }
];

export const INITIAL_RECURRING_ITEMS: RecurringItem[] = [
  { id: 'rec_subs', name: 'Subscriptions', type: 'subscription', amount: 0, description: 'No active subs', count: 0 },
  { id: 'rec_fixed', name: 'Fixed Payments', type: 'fixed', amount: 0, description: 'No fixed bills', count: 0 },
  { id: 'rec_split', name: 'Split Bill', type: 'split', amount: 0, description: 'No splits yet', count: 0 },
  { id: 'rec_wish', name: 'Wishlist', type: 'wishlist', amount: 0, description: 'No wishes yet', count: 0 },
  { id: 'rec_ghost', name: 'Ghost Budget', type: 'ghost', amount: 0, description: 'Tap to set up', count: 0 },
  { id: 'rec_debts', name: 'Owe & Lend', type: 'debt', amount: 0, description: 'No active debts', count: 0 }
];

export const INITIAL_CHALLENGE: Challenge = {
  id: 'challenge_1',
  title: '4 No-Spend Days',
  current: 0,
  total: 4,
  streak: 0,
  daysLeft: 5
};

export const INITIAL_SETTINGS: UserSettings = {
  currency: 'USD', // Symbol $
  language: 'English',
  theme: 'System Default',
  monthlyIncome: 0,
  monthlySavingsGoal: 0,
  incomeDay: 1,
  paydayReminder: false,
  lowBalanceAlert: false,
  savingsGoalAlerts: false,
  highExpenseAlert: false,
  bankBalanceReminder: false,
  weeklySummary: false,
  inactivityNudge: false,
  dailyBalanceReminder: false,
  spendingMilestones: false
};

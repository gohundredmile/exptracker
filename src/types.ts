export interface Profile {
  id: string;
  name: string;
  is_default: boolean;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'credit';
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'expense' | 'income';
  date: string;
  category: string;
  pay_from_account_id: string;
  paid_for: string; // matches profile name or profile id
  note: string;
  is_scheduled: boolean;
}

export interface RecurringItem {
  id: string;
  name: string;
  type: 'subscription' | 'fixed' | 'split' | 'wishlist' | 'ghost' | 'debt';
  amount: number;
  description: string;
  count: number;
}

export interface Challenge {
  id: string;
  title: string;
  current: number;
  total: number;
  streak: number;
  daysLeft: number;
}

export interface UserSettings {
  currency: string; // e.g. 'USD' or 'BDT'
  language: string;
  theme: string;
  monthlyIncome: number;
  monthlySavingsGoal: number;
  incomeDay: number;
  paydayReminder: boolean;
  lowBalanceAlert: boolean;
  savingsGoalAlerts: boolean;
  highExpenseAlert: boolean;
  bankBalanceReminder: boolean;
  weeklySummary: boolean;
  inactivityNudge: boolean;
  dailyBalanceReminder: boolean;
  spendingMilestones: boolean;
}

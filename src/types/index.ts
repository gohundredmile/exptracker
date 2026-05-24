// ══════════════════════════════════════════════
// CORE ENTITY TYPES
// ══════════════════════════════════════════════

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  currency: string;
  monthly_budget: number;
  theme: 'light' | 'dark';
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: 'cash' | 'bank' | 'card';
  balance: number;
  color: string;
  icon: string;
  is_default: boolean;
}

export interface Category {
  id: number;
  user_id: string | null;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income' | 'both';
  budget_limit: number | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  note: string | null;
  receipt_url: string | null;
  is_recurring: boolean;
  recurring_interval: 'daily' | 'weekly' | 'monthly' | null;
  transfer_to_account_id: string | null;
  created_at: string;
  // Joined fields
  category?: Category;
  account?: Account;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: number;
  amount: number;
  month: string;
  spent: number;
  created_at: string;
  // Joined fields
  category?: Category;
}

// ══════════════════════════════════════════════
// FORM TYPES
// ══════════════════════════════════════════════

export interface TransactionFormData {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: number;
  account_id: string;
  date: string;
  note: string;
  is_recurring: boolean;
  recurring_interval: 'daily' | 'weekly' | 'monthly' | null;
  transfer_to_account_id: string | null;
}

export interface ProfileFormData {
  full_name: string;
  currency: string;
  monthly_budget: number;
  theme: 'light' | 'dark';
}

export interface AccountFormData {
  name: string;
  type: 'cash' | 'bank' | 'card';
  balance: number;
  color: string;
  icon: string;
  is_default: boolean;
}

export interface BudgetFormData {
  category_id: number;
  amount: number;
  month: string;
}

// ══════════════════════════════════════════════
// AUTH TYPES
// ══════════════════════════════════════════════

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_accepted: boolean;
}

// ══════════════════════════════════════════════
// UI TYPES
// ══════════════════════════════════════════════

export type TabName = 'dashboard' | 'transactions' | 'add' | 'reports' | 'profile';

export interface FilterOptions {
  type: 'all' | 'income' | 'expense' | 'transfer';
  category_id: number | null;
  account_id: string | null;
  date_from: string | null;
  date_to: string | null;
  sort_by: 'date' | 'amount';
  sort_order: 'asc' | 'desc';
}

export interface DateRange {
  from: string;
  to: string;
}

export type ReportPeriod = 'week' | 'month' | 'year' | 'custom';

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyChartData {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySummary {
  category: Category;
  total: number;
  percentage: number;
  transactions: number;
}

// ══════════════════════════════════════════════
// CURRENCY TYPE
// ══════════════════════════════════════════════

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

// ══════════════════════════════════════════════
// NOTIFICATION TYPE
// ══════════════════════════════════════════════

export interface BudgetAlert {
  category: Category;
  budget: Budget;
  percentage: number;
}

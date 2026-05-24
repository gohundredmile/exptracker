import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Transaction,
  Account,
  Category,
  Budget,
  Profile,
  FilterOptions,
} from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { generateId, getCurrentMonth } from '../lib/helpers';
import { format } from 'date-fns';

// ══════════════════════════════════════════════
// DEFAULT DATA
// ══════════════════════════════════════════════

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    user_id: 'demo-user',
    name: 'My Wallet',
    type: 'cash',
    balance: 1250.00,
    color: '#00C897',
    icon: '👛',
    is_default: true,
  },
  {
    id: 'acc-2',
    user_id: 'demo-user',
    name: 'Bank Account',
    type: 'bank',
    balance: 5840.50,
    color: '#6C63FF',
    icon: '🏦',
    is_default: false,
  },
  {
    id: 'acc-3',
    user_id: 'demo-user',
    name: 'Credit Card',
    type: 'card',
    balance: -320.75,
    color: '#FF6B6B',
    icon: '💳',
    is_default: false,
  },
];

const TODAY = format(new Date(), 'yyyy-MM-dd');
const YESTERDAY = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
const TWO_DAYS_AGO = format(new Date(Date.now() - 172800000), 'yyyy-MM-dd');
const THREE_DAYS_AGO = format(new Date(Date.now() - 259200000), 'yyyy-MM-dd');
const WEEK_AGO = format(new Date(Date.now() - 604800000), 'yyyy-MM-dd');

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-2',
    category_id: 17,
    title: 'Monthly Salary',
    amount: 5000.00,
    type: 'income',
    date: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    note: 'Regular monthly salary',
    receipt_url: null,
    is_recurring: true,
    recurring_interval: 'monthly',
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-1',
    category_id: 1,
    title: 'Lunch at Cafe',
    amount: 18.50,
    type: 'expense',
    date: TODAY,
    note: 'Had a nice lunch',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-3',
    category_id: 3,
    title: 'Online Shopping',
    amount: 89.99,
    type: 'expense',
    date: TODAY,
    note: 'Bought some clothes',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-1',
    category_id: 2,
    title: 'Uber Ride',
    amount: 12.00,
    type: 'expense',
    date: YESTERDAY,
    note: null,
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-2',
    category_id: 18,
    title: 'Freelance Project',
    amount: 750.00,
    type: 'income',
    date: YESTERDAY,
    note: 'Website design project',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-1',
    category_id: 7,
    title: 'Electricity Bill',
    amount: 65.00,
    type: 'expense',
    date: TWO_DAYS_AGO,
    note: 'Monthly electricity',
    receipt_url: null,
    is_recurring: true,
    recurring_interval: 'monthly',
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-3',
    category_id: 4,
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    date: TWO_DAYS_AGO,
    note: null,
    receipt_url: null,
    is_recurring: true,
    recurring_interval: 'monthly',
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-1',
    category_id: 5,
    title: 'Pharmacy',
    amount: 32.40,
    type: 'expense',
    date: THREE_DAYS_AGO,
    note: 'Cold medicine',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-2',
    category_id: 9,
    title: 'Flight to NYC',
    amount: 245.00,
    type: 'expense',
    date: WEEK_AGO,
    note: 'Business trip',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    user_id: 'demo-user',
    account_id: 'acc-1',
    category_id: 1,
    title: 'Grocery Shopping',
    amount: 87.30,
    type: 'expense',
    date: WEEK_AGO,
    note: 'Weekly groceries',
    receipt_url: null,
    is_recurring: false,
    recurring_interval: null,
    transfer_to_account_id: null,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_BUDGETS: Budget[] = [
  { id: generateId(), user_id: 'demo-user', category_id: 1, amount: 600, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
  { id: generateId(), user_id: 'demo-user', category_id: 2, amount: 200, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
  { id: generateId(), user_id: 'demo-user', category_id: 3, amount: 300, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
  { id: generateId(), user_id: 'demo-user', category_id: 4, amount: 100, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
  { id: generateId(), user_id: 'demo-user', category_id: 7, amount: 250, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
  { id: generateId(), user_id: 'demo-user', category_id: 9, amount: 500, month: getCurrentMonth(), spent: 0, created_at: new Date().toISOString() },
];

const DEFAULT_PROFILE: Profile = {
  id: 'demo-user',
  full_name: 'Alex Johnson',
  avatar_url: null,
  currency: 'USD',
  monthly_budget: 3000,
  theme: 'light',
  created_at: new Date().toISOString(),
};

// ══════════════════════════════════════════════
// STORE INTERFACE
// ══════════════════════════════════════════════

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userId: string;

  // Data
  profile: Profile;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];

  // UI State
  activeTab: string;
  selectedMonth: string;
  filterOptions: FilterOptions;
  darkMode: boolean;
  isOnboarded: boolean;

  // Actions - Auth
  login: (email: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: () => void;

  // Actions - Profile
  updateProfile: (data: Partial<Profile>) => void;

  // Actions - Transactions
  addTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Accounts
  addAccount: (data: Omit<Account, 'id' | 'user_id'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Actions - Categories
  addCategory: (data: Omit<Category, 'id' | 'user_id'>) => void;
  updateCategory: (id: number, data: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  // Actions - Budgets
  addBudget: (data: Omit<Budget, 'id' | 'user_id' | 'spent' | 'created_at'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Actions - UI
  setActiveTab: (tab: string) => void;
  setSelectedMonth: (month: string) => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  toggleDarkMode: () => void;
}

// ══════════════════════════════════════════════
// STORE IMPLEMENTATION
// ══════════════════════════════════════════════

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userId: 'demo-user',
      profile: DEFAULT_PROFILE,
      accounts: DEFAULT_ACCOUNTS,
      categories: DEFAULT_CATEGORIES as Category[],
      transactions: DEMO_TRANSACTIONS,
      budgets: DEFAULT_BUDGETS,
      activeTab: 'dashboard',
      selectedMonth: getCurrentMonth(),
      filterOptions: {
        type: 'all',
        category_id: null,
        account_id: null,
        date_from: null,
        date_to: null,
        sort_by: 'date',
        sort_order: 'desc',
      },
      darkMode: false,
      isOnboarded: false,

      // Auth actions
      login: (_email: string, name?: string) => {
        set(state => ({
          isAuthenticated: true,
          profile: {
            ...state.profile,
            full_name: name ?? state.profile.full_name,
          },
        }));
      },

      logout: () => {
        set({
          isAuthenticated: false,
          isOnboarded: false,
        });
      },

      completeOnboarding: () => {
        set({ isOnboarded: true, isAuthenticated: true });
      },

      // Profile actions
      updateProfile: (data) => {
        set(state => ({
          profile: { ...state.profile, ...data },
          darkMode: data.theme === 'dark' ? true : data.theme === 'light' ? false : state.darkMode,
        }));
      },

      // Transaction actions
      addTransaction: (data) => {
        const newTransaction: Transaction = {
          ...data,
          id: generateId(),
          user_id: get().userId,
          created_at: new Date().toISOString(),
        };

        // Update account balance
        set(state => {
          const updatedAccounts = state.accounts.map(acc => {
            if (acc.id === data.account_id) {
              const balanceChange = data.type === 'income'
                ? data.amount
                : data.type === 'expense'
                  ? -data.amount
                  : -data.amount; // Transfer: deduct from source
              return { ...acc, balance: acc.balance + balanceChange };
            }
            if (data.type === 'transfer' && acc.id === data.transfer_to_account_id) {
              return { ...acc, balance: acc.balance + data.amount };
            }
            return acc;
          });

          return {
            transactions: [newTransaction, ...state.transactions],
            accounts: updatedAccounts,
          };
        });
      },

      updateTransaction: (id, data) => {
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        const transaction = get().transactions.find(t => t.id === id);
        if (!transaction) return;

        // Reverse the balance change
        set(state => {
          const updatedAccounts = state.accounts.map(acc => {
            if (acc.id === transaction.account_id) {
              const balanceChange = transaction.type === 'income'
                ? -transaction.amount
                : transaction.type === 'expense'
                  ? transaction.amount
                  : transaction.amount; // Reverse transfer
              return { ...acc, balance: acc.balance + balanceChange };
            }
            if (transaction.type === 'transfer' && acc.id === transaction.transfer_to_account_id) {
              return { ...acc, balance: acc.balance - transaction.amount };
            }
            return acc;
          });

          return {
            transactions: state.transactions.filter(t => t.id !== id),
            accounts: updatedAccounts,
          };
        });
      },

      // Account actions
      addAccount: (data) => {
        const newAccount: Account = {
          ...data,
          id: generateId(),
          user_id: get().userId,
        };
        set(state => ({ accounts: [...state.accounts, newAccount] }));
      },

      updateAccount: (id, data) => {
        set(state => ({
          accounts: state.accounts.map(a => a.id === id ? { ...a, ...data } : a),
        }));
      },

      deleteAccount: (id) => {
        set(state => ({
          accounts: state.accounts.filter(a => a.id !== id),
        }));
      },

      // Category actions
      addCategory: (data) => {
        const existingIds = get().categories.map(c => c.id);
        const newId = Math.max(...existingIds) + 1;
        const newCategory: Category = {
          ...data,
          id: newId,
          user_id: get().userId,
          budget_limit: null,
        };
        set(state => ({ categories: [...state.categories, newCategory] }));
      },

      updateCategory: (id, data) => {
        set(state => ({
          categories: state.categories.map(c => c.id === id ? { ...c, ...data } : c),
        }));
      },

      deleteCategory: (id) => {
        set(state => ({
          categories: state.categories.filter(c => c.id !== id),
        }));
      },

      // Budget actions
      addBudget: (data) => {
        const newBudget: Budget = {
          ...data,
          id: generateId(),
          user_id: get().userId,
          spent: 0,
          created_at: new Date().toISOString(),
        };
        set(state => ({ budgets: [...state.budgets, newBudget] }));
      },

      updateBudget: (id, data) => {
        set(state => ({
          budgets: state.budgets.map(b => b.id === id ? { ...b, ...data } : b),
        }));
      },

      deleteBudget: (id) => {
        set(state => ({
          budgets: state.budgets.filter(b => b.id !== id),
        }));
      },

      // UI actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setFilterOptions: (options) => {
        set(state => ({
          filterOptions: { ...state.filterOptions, ...options },
        }));
      },
      toggleDarkMode: () => {
        set(state => {
          const newDark = !state.darkMode;
          return {
            darkMode: newDark,
            profile: { ...state.profile, theme: newDark ? 'dark' : 'light' },
          };
        });
      },
    }),
    {
      name: 'wealthwise-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        profile: state.profile,
        accounts: state.accounts,
        categories: state.categories,
        transactions: state.transactions,
        budgets: state.budgets,
        darkMode: state.darkMode,
        selectedMonth: state.selectedMonth,
      }),
    }
  )
);

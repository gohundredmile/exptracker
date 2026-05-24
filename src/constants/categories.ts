import type { Category } from '../types';

// ══════════════════════════════════════════════
// DEFAULT CATEGORIES
// ══════════════════════════════════════════════

export const DEFAULT_CATEGORIES: Omit<Category, 'user_id' | 'budget_limit'>[] = [
  // Expense Categories
  { id: 1, name: 'Food & Dining', icon: '🍕', color: '#FF6B6B', type: 'expense' },
  { id: 2, name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: 3, name: 'Shopping', icon: '🛍️', color: '#45B7D1', type: 'expense' },
  { id: 4, name: 'Entertainment', icon: '🎬', color: '#96CEB4', type: 'expense' },
  { id: 5, name: 'Health', icon: '🏥', color: '#F1948A', type: 'expense' },
  { id: 6, name: 'Education', icon: '📚', color: '#BB8FCE', type: 'expense' },
  { id: 7, name: 'Bills & Utilities', icon: '⚡', color: '#F7DC6F', type: 'expense' },
  { id: 8, name: 'Housing', icon: '🏠', color: '#82E0AA', type: 'expense' },
  { id: 9, name: 'Travel', icon: '✈️', color: '#85C1E9', type: 'expense' },
  { id: 10, name: 'Beauty', icon: '💄', color: '#DDA0DD', type: 'expense' },
  { id: 11, name: 'Sports', icon: '⚽', color: '#98D8C8', type: 'expense' },
  { id: 12, name: 'Pets', icon: '🐾', color: '#F8C471', type: 'expense' },
  { id: 13, name: 'Gifts', icon: '🎁', color: '#F9E79F', type: 'expense' },
  { id: 14, name: 'Insurance', icon: '🛡️', color: '#AED6F1', type: 'expense' },
  { id: 15, name: 'Investment', icon: '📈', color: '#A9DFBF', type: 'expense' },
  { id: 16, name: 'Other Expense', icon: '💸', color: '#FFEAA7', type: 'expense' },

  // Income Categories
  { id: 17, name: 'Salary', icon: '💰', color: '#00C897', type: 'income' },
  { id: 18, name: 'Freelance', icon: '💻', color: '#00B4D8', type: 'income' },
  { id: 19, name: 'Investment Return', icon: '📊', color: '#6C63FF', type: 'income' },
  { id: 20, name: 'Business', icon: '🏢', color: '#2ECC71', type: 'income' },
  { id: 21, name: 'Rental', icon: '🏘️', color: '#27AE60', type: 'income' },
  { id: 22, name: 'Gift', icon: '🎀', color: '#E74C3C', type: 'income' },
  { id: 23, name: 'Bonus', icon: '🎯', color: '#F39C12', type: 'income' },
  { id: 24, name: 'Other Income', icon: '💵', color: '#1ABC9C', type: 'income' },
];

export const EXPENSE_CATEGORIES = DEFAULT_CATEGORIES.filter(c => c.type === 'expense');
export const INCOME_CATEGORIES = DEFAULT_CATEGORIES.filter(c => c.type === 'income');

export const getCategoryById = (id: number): Category | undefined => {
  return DEFAULT_CATEGORIES.find(c => c.id === id) as Category | undefined;
};

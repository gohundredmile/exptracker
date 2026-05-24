// ══════════════════════════════════════════════
// COLOR PALETTE - WealthWise
// ══════════════════════════════════════════════

export const COLORS = {
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#5A52E0',
  income: '#00C897',
  incomeLight: '#E6FFF9',
  expense: '#FF6B6B',
  expenseLight: '#FFF0F0',
  transfer: '#F7B731',
  transferLight: '#FFF8E6',

  // Light mode
  light: {
    background: '#F8F9FF',
    card: '#FFFFFF',
    textPrimary: '#2D3748',
    textSecondary: '#718096',
    border: '#E2E8F0',
    divider: '#EDF2F7',
    tabBar: '#FFFFFF',
    inputBg: '#F7F8FC',
  },

  // Dark mode
  dark: {
    background: '#1A1A2E',
    card: '#16213E',
    textPrimary: '#E2E8F0',
    textSecondary: '#A0AEC0',
    border: '#2D3748',
    divider: '#2D3748',
    tabBar: '#16213E',
    inputBg: '#0F3460',
  },

  // Category colors
  categories: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Purple
    '#85C1E9', // Sky
    '#F1948A', // Salmon
    '#82E0AA', // Light Green
    '#F8C471', // Orange
    '#AED6F1', // Light Blue
    '#F9E79F', // Pale Yellow
    '#A9DFBF', // Pale Green
  ],
} as const;

// Account type colors
export const ACCOUNT_COLORS = {
  cash: '#00C897',
  bank: '#6C63FF',
  card: '#FF6B6B',
} as const;

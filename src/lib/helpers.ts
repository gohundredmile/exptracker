import { format, parseISO, isToday, isYesterday, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, subMonths } from 'date-fns';
import { getCurrencyByCode } from '../constants/currencies';
import type { ReportPeriod, DateRange } from '../types';

// ══════════════════════════════════════════════
// CURRENCY FORMATTING
// ══════════════════════════════════════════════

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = getCurrencyByCode(currencyCode);
  const symbol = currency?.symbol ?? '$';

  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatted}`;
};

export const formatAmount = (amount: number, type: 'income' | 'expense' | 'transfer', currencyCode: string = 'USD'): string => {
  const formatted = formatCurrency(amount, currencyCode);
  if (type === 'income') return `+${formatted}`;
  if (type === 'expense') return `-${formatted}`;
  return formatted;
};

// ══════════════════════════════════════════════
// DATE FORMATTING
// ══════════════════════════════════════════════

export const formatDate = (dateStr: string): string => {
  try {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatDateShort = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMM dd');
  } catch {
    return dateStr;
  }
};

export const formatMonthYear = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr + '-01'), 'MMMM yyyy');
  } catch {
    return dateStr;
  }
};

export const getCurrentMonth = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthLabel = (monthStr: string): string => {
  try {
    return format(parseISO(monthStr + '-01'), 'MMMM yyyy');
  } catch {
    return monthStr;
  }
};

export const getPreviousMonth = (monthStr: string): string => {
  const date = parseISO(monthStr + '-01');
  return format(subMonths(date, 1), 'yyyy-MM');
};

export const getNextMonth = (monthStr: string): string => {
  const date = parseISO(monthStr + '-01');
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return format(nextDate, 'yyyy-MM');
};

export const getDateRange = (period: ReportPeriod, customRange?: DateRange): DateRange => {
  const now = new Date();

  switch (period) {
    case 'week':
      return {
        from: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        to: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      };
    case 'month':
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    case 'year':
      return {
        from: format(startOfYear(now), 'yyyy-MM-dd'),
        to: format(endOfYear(now), 'yyyy-MM-dd'),
      };
    case 'custom':
      return customRange ?? {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    default:
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
  }
};

// ══════════════════════════════════════════════
// NUMBER UTILITIES
// ══════════════════════════════════════════════

export const calculatePercentage = (spent: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min((spent / total) * 100, 100);
};

export const abbreviateAmount = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toFixed(2);
};

// ══════════════════════════════════════════════
// COLOR UTILITIES
// ══════════════════════════════════════════════

export const hexToRgba = (hex: string, alpha: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

// ══════════════════════════════════════════════
// GREETING
// ══════════════════════════════════════════════

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ══════════════════════════════════════════════
// INITIALS
// ══════════════════════════════════════════════

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ══════════════════════════════════════════════
// CSV EXPORT
// ══════════════════════════════════════════════

export const transactionsToCSV = (transactions: Array<{
  date: string;
  title: string;
  type: string;
  amount: number;
  category?: { name: string };
  account?: { name: string };
  note?: string | null;
}>): string => {
  const headers = ['Date', 'Title', 'Type', 'Amount', 'Category', 'Account', 'Note'];
  const rows = transactions.map(t => [
    t.date,
    `"${t.title}"`,
    t.type,
    t.amount.toString(),
    `"${t.category?.name ?? ''}"`,
    `"${t.account?.name ?? ''}"`,
    `"${t.note ?? ''}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ══════════════════════════════════════════════
// UNIQUE ID (for demo mode without Supabase)
// ══════════════════════════════════════════════

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

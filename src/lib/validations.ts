import { z } from 'zod';

// ══════════════════════════════════════════════
// AUTH SCHEMAS
// ══════════════════════════════════════════════

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms & conditions'),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

// ══════════════════════════════════════════════
// TRANSACTION SCHEMA
// ══════════════════════════════════════════════

export const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  amount: z.number().positive('Amount must be greater than 0').max(999_999_999, 'Amount too large'),
  type: z.enum(['income', 'expense', 'transfer']),
  category_id: z.number().int().positive('Please select a category'),
  account_id: z.string().min(1, 'Please select an account'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().max(500, 'Note too long').optional().default(''),
  is_recurring: z.boolean().default(false),
  recurring_interval: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
  transfer_to_account_id: z.string().nullable().optional(),
});

// ══════════════════════════════════════════════
// PROFILE SCHEMA
// ══════════════════════════════════════════════

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  currency: z.string().length(3, 'Please select a valid currency'),
  monthly_budget: z.number().nonnegative('Budget cannot be negative'),
  theme: z.enum(['light', 'dark']),
});

// ══════════════════════════════════════════════
// ACCOUNT SCHEMA
// ══════════════════════════════════════════════

export const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(50, 'Name too long'),
  type: z.enum(['cash', 'bank', 'card']),
  balance: z.number().default(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  icon: z.string().min(1, 'Icon is required'),
  is_default: z.boolean().default(false),
});

// ══════════════════════════════════════════════
// BUDGET SCHEMA
// ══════════════════════════════════════════════

export const budgetSchema = z.object({
  category_id: z.number().int().positive('Please select a category'),
  amount: z.number().positive('Budget amount must be greater than 0'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format'),
});

// ══════════════════════════════════════════════
// CATEGORY SCHEMA
// ══════════════════════════════════════════════

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(30, 'Name too long'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  type: z.enum(['expense', 'income', 'both']),
  budget_limit: z.number().nonnegative().nullable().optional(),
});

// ══════════════════════════════════════════════
// TYPES FROM SCHEMAS
// ══════════════════════════════════════════════

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type TransactionSchema = z.infer<typeof transactionSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type AccountSchema = z.infer<typeof accountSchema>;
export type BudgetSchema = z.infer<typeof budgetSchema>;
export type CategorySchema = z.infer<typeof categorySchema>;

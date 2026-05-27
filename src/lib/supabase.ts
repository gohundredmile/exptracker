import { createClient } from '@supabase/supabase-js';
import { Profile, Account, Transaction, RecurringItem, Challenge, UserSettings } from '../types';

// Let's create helper to retrieve UI override keys or env fallback keys
export function getSupabaseCredentials() {
  const localUrl = localStorage.getItem('supabase_url') || '';
  const localKey = localStorage.getItem('supabase_anon_key') || '';
  
  // env fallback
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: localUrl || envUrl || '',
    key: localKey || envKey || ''
  };
}

const { url, key } = getSupabaseCredentials();

// Verify client can be initialized and is not template defaults
const isConfigured = url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isConfigured ? createClient(url, key) : null;

// This helper generates the Postgres schema SQL for Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- Expense & Budget Tracker Schema SQL
-- Copy and execute this script inside your Supabase SQL Editor!

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.expenses_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS public.expenses_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  type TEXT NOT NULL, -- 'bank' or 'credit'
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS public.expenses_transactions (
  id TEXT PRIMARY KEY,
  amount NUMERIC(15, 2) NOT NULL,
  type TEXT NOT NULL, -- 'expense' or 'income'
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  pay_from_account_id TEXT NOT NULL,
  paid_for TEXT NOT NULL,
  note TEXT,
  is_scheduled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Recurring Items Table
CREATE TABLE IF NOT EXISTS public.expenses_recurring (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  description TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Active Challenge Table
CREATE TABLE IF NOT EXISTS public.expenses_challenge (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  current INTEGER DEFAULT 0,
  total INTEGER DEFAULT 4,
  streak INTEGER DEFAULT 0,
  days_left INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default items to seed if empty
INSERT INTO public.expenses_accounts (id, name, balance, type, icon)
VALUES 
('bank_acc', 'Bank Account', 0.00, 'bank', 'Building'),
('credit_card', 'Credit Card', 0.00, 'credit', 'CreditCard')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.expenses_challenge (id, title, current, total, streak, days_left)
VALUES ('challenge_1', '4 No-Spend Days', 0, 4, 0, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.expenses_recurring (id, name, type, amount, description, count)
VALUES
('rec_subs', 'Subscriptions', 'subscription', 0, 'No active subs', 0),
('rec_fixed', 'Fixed Payments', 'fixed', 0, 'No fixed bills', 0),
('rec_split', 'Split Bill', 'split', 0, 'No splits yet', 0),
('rec_wish', 'Wishlist', 'wishlist', 0, 'No wishes yet', 0),
('rec_ghost', 'Ghost Budget', 'ghost', 0, 'Tap to set up', 0),
('rec_debts', 'Owe & Lend', 'debt', 0, 'No active debts', 0)
ON CONFLICT (id) DO NOTHING;
`;

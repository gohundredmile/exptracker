# 📊 Expense & Budget Tracker

A highly-polished single-page React app styled with Tailwind CSS, supporting advanced streaks, budget health scores, active trophies challenges, and real-time backend synchronization with **Supabase**.

This application is ready to be loaded to GitHub and deployed straight to **Cloudflare Pages**!

---

## 🛠️ Supabase Database Setup (Fast SQL Script)

If you are just pushing this repository to GitHub and deploying to Cloudflare, you do not need to read code. Simply set up your database using these 3 simple steps:

1. **Create a Supabase Project**: Go to [supabase.com](https://supabase.com/) and spin up a new free project.
2. **Execute Postgres Script**: In your Supabase Dashboard, click on **SQL Editor** in the left menu, select **New Query**, paste the code below, and click **Run**:

```sql
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
  id TEXT PRIMARYEN KEY,
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

-- Insert Default items to seed
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
```

---

## 🚀 Cloudflare Pages Deploys (Static Web Frontend)

Cloudflare Pages makes deployment simple:

1. Push your code repository on your personal **GitHub** account.
2. Visit **Cloudflare Dashboard** -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your repository.
4. Use the following build parameters:
   - **Framework Preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### 🔐 Add Environment Secrets on Cloudflare (Optional)

To secure syncing immediately when anyone loads your frontend URL:
- In your Page's Dashboard -> **Settings** -> **Environment variables** -> **Add Variables**:
  - `VITE_SUPABASE_URL` = (Your Supabase URL from API settings)
  - `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon Key from API settings)

If you don't set these, the applet operates in fully-functional secure **LocalStorage mode**, and users can safely copy.paste or type in their keys directly within the **Settings** view of the running website!

---

## 🔥 Awesome Features Programmed In

- **Interactive Profiles**: Switch profiles or add custom names like "Rana". Selecting different profiles triggers custom currency shifts (e.g. BDT currency `৳` for Rana, or USD `$` for Personal).
- **Streak Counters & Heart health triggers**: Interactive no spend streak counters with automated healthy/critical ratings.
- **Trophies challenges**: Complete daily activities to update milestones.
- **Segmented Donuts (Recharts)**: Fully polished donut graphical analysis summarizing expense divisions dynamically.
- **Transactions logging**: Beautiful interactive month scrolling widgets (`< May 2026 >`) with income-expense grids.

# SpendWise - Expense & Budget Tracker

A beautiful, mobile-first expense tracking app built with React + TypeScript + Tailwind CSS + Supabase.

## Features

- **Dashboard**: View total balance, income/expense summary, spend pulse, no-spend streak, health score, and active challenges
- **Add Transaction**: Quick expense/income entry with categories, amounts, dates, and notes
- **Transaction History**: Browse all transactions with month navigation and filtering
- **Statistics**: Visual analytics with donut charts and expense breakdown by category
- **Settings**: Multiple profiles, currency/language preferences, notification toggles, and more
- **Authentication**: Secure email/password login powered by Supabase Auth

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Cloudflare Pages (static site hosting)

---

## Setup Instructions (Step by Step)

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Give it a name (e.g., "spendwise")
4. Choose a region close to you
5. Set a database password (save this somewhere safe)
6. Click "Create new project"
7. Wait for the project to be created (this takes a few minutes)

### Step 2: Set Up the Database

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New query"
3. Open the file `supabase/setup.sql` from this project
4. Copy ALL the SQL code and paste it into the SQL Editor
5. Click "Run" to execute the SQL
6. This creates all tables, security policies, and default data

### Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public** API key (starts with `eyJ...`)

### Step 4: Set Up Environment Variables

1. In this project folder, find the file `.env.example`
2. Make a copy and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 5: Deploy to Cloudflare Pages

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and sign up/login
2. Click "Pages" in the left sidebar, then "Create a project"
3. Connect your GitHub account and select this repository
4. In the build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click "Add environment variable" and add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click "Save and Deploy"
7. Wait for the build to complete (about 1-2 minutes)
8. Your app will be live at a URL like `https://spendwise.pages.dev`

### Step 6: Push to GitHub (Optional)

If you want to use GitHub + Cloudflare Pages auto-deployment:

1. Create a new repository on GitHub (don't initialize with README)
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. Then follow Step 5 above to connect Cloudflare Pages to your GitHub repo

---

## Project Structure

```
spendwise/
  src/
    components/         # Reusable UI components
      BottomNav.tsx     # Bottom tab navigation
      AppLayout.tsx     # App shell wrapper
    hooks/              # Custom React hooks
      useAuth.tsx       # Authentication hook
      useData.ts        # Data fetching hooks
    lib/                # Utilities
      supabase.ts       # Supabase client
    pages/              # App screens
      Home.tsx          # Dashboard
      AddTransaction.tsx # Add expense/income
      Transactions.tsx  # Transaction list
      Statistics.tsx    # Charts & analytics
      Settings.tsx      # App settings
      Login.tsx         # Login/signup
    types/              # TypeScript types
      database.ts       # Database schema types
  public/               # Static assets
    manifest.json       # PWA manifest
    icon-192.png        # App icon
    icon-512.png        # App icon large
  supabase/
    setup.sql           # Database setup script
  .env.example          # Environment variable template
  README.md             # This file
```

## Database Schema

The app uses these Supabase tables:

- **profiles** - User profiles (Personal, Business, etc.)
- **accounts** - Bank accounts, credit cards, cash wallets
- **categories** - Expense/income categories with icons and colors
- **transactions** - All financial records
- **user_settings** - Preferences (currency, language, notifications)
- **challenges** - Gamification challenges (no-spend streaks)

All tables have **Row Level Security (RLS)** enabled - users can only access their own data.

## Local Development

If you want to run locally before deploying:

```bash
# Install dependencies
npm install

# Set up your .env file (see Step 4 above)

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Security

- All database queries use Row Level Security (RLS) - users can only access their own data
- Authentication is handled by Supabase Auth with secure JWT tokens
- API keys are stored as environment variables, never in the code
- Passwords are securely hashed by Supabase (you never handle raw passwords)

## Support

If you need help:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the Cloudflare Pages documentation: https://developers.cloudflare.com/pages
3. The app is a Progressive Web App (PWA) - you can install it on your phone's home screen

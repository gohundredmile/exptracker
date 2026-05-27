import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Transaction {
  id: string
  user_id: string
  profile_id: string | null
  account_id: string | null
  category_id: string
  type: 'expense' | 'income'
  amount: number
  description: string
  note: string | null
  date: string
  created_at: string
  updated_at: string
  categories?: { name: string; color: string } | null
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'bank' | 'credit_card' | 'cash' | 'wallet'
  balance: number
  color: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  type: 'expense' | 'income'
  icon: string
  color: string
  bg_color: string
  is_default: boolean
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  language: string
  currency: string
  theme: string
  monthly_income: number | null
  monthly_savings_goal: number | null
  income_day: number
  bank_accounts_enabled: boolean
  payday_reminder: boolean
  low_balance_alert: boolean
  savings_goal_alerts: boolean
  high_expense_alert: boolean
  bank_balance_reminder: boolean
  weekly_summary: boolean
  inactivity_nudge: boolean
  daily_balance_reminder: boolean
  spending_milestones: boolean
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  user_id: string
  title: string
  description: string
  target_days: number
  current_days: number
  streak: number
  days_left: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Default categories for the app
const defaultCategories: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
  { name: 'Alcohol', type: 'expense', icon: 'wine', color: '#D97706', bg_color: '#FEF3C7', is_default: true },
  { name: 'Beauty', type: 'expense', icon: 'scissors', color: '#EC4899', bg_color: '#FCE7F3', is_default: true },
  { name: 'Bills', type: 'expense', icon: 'file-text', color: '#3B82F6', bg_color: '#DBEAFE', is_default: true },
  { name: 'Car', type: 'expense', icon: 'car', color: '#6366F1', bg_color: '#E0E7FF', is_default: true },
  { name: 'Cigarettes', type: 'expense', icon: 'cigarette', color: '#6B7280', bg_color: '#F3F4F6', is_default: true },
  { name: 'Clothing', type: 'expense', icon: 'shirt', color: '#EC4899', bg_color: '#FCE7F3', is_default: true },
  { name: 'Donations', type: 'expense', icon: 'hand-heart', color: '#3B82F6', bg_color: '#DBEAFE', is_default: true },
  { name: 'Education', type: 'expense', icon: 'graduation-cap', color: '#10B981', bg_color: '#D1FAE5', is_default: true },
  { name: 'Electronics', type: 'expense', icon: 'monitor', color: '#D97706', bg_color: '#FEF3C7', is_default: true },
  { name: 'Entertainment', type: 'expense', icon: 'gamepad-2', color: '#8B5CF6', bg_color: '#EDE9FE', is_default: true },
  { name: 'Food', type: 'expense', icon: 'utensils', color: '#F59E0B', bg_color: '#FEF3C7', is_default: true },
  { name: 'Groceries', type: 'expense', icon: 'shopping-cart', color: '#10B981', bg_color: '#D1FAE5', is_default: true },
  { name: 'Health', type: 'expense', icon: 'heart-pulse', color: '#EF4444', bg_color: '#FEE2E2', is_default: true },
  { name: 'Housing', type: 'expense', icon: 'home', color: '#3B82F6', bg_color: '#DBEAFE', is_default: true },
  { name: 'Insurance', type: 'expense', icon: 'shield', color: '#6366F1', bg_color: '#E0E7FF', is_default: true },
  { name: 'Salary', type: 'income', icon: 'banknote', color: '#10B981', bg_color: '#D1FAE5', is_default: true },
  { name: 'Freelance', type: 'income', icon: 'laptop', color: '#3B82F6', bg_color: '#DBEAFE', is_default: true },
  { name: 'Investments', type: 'income', icon: 'trending-up', color: '#8B5CF6', bg_color: '#EDE9FE', is_default: true },
  { name: 'Gifts', type: 'income', icon: 'gift', color: '#EC4899', bg_color: '#FCE7F3', is_default: true },
  { name: 'Other Income', type: 'income', icon: 'coins', color: '#F59E0B', bg_color: '#FEF3C7', is_default: true },
]

export function useTransactions(month?: Date) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('transactions')
      .select('*, categories(name, color)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (month) {
      const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString().split('T')[0]
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0]
      query = query.gte('date', start).lte('date', end)
    }

    const { data, error } = await query
    if (!error && data) {
      setTransactions(data as unknown as Transaction[])
    }
    setLoading(false)
  }, [user, month])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (transaction: {
    user_id: string
    profile_id?: string | null
    account_id?: string | null
    category_id: string
    type: 'expense' | 'income'
    amount: number
    description: string
    note?: string | null
    date: string
  }) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction as any)
      .select()
      .single()
    if (!error) fetchTransactions()
    return { data: data as Transaction | null, error }
  }

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) fetchTransactions()
    return { error }
  }

  return { transactions, loading, addTransaction, deleteTransaction, refresh: fetchTransactions }
}

export function useAccounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
    if (!error && data) setAccounts(data as unknown as Account[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const addAccount = async (account: {
    user_id: string
    name: string
    type: 'bank' | 'credit_card' | 'cash' | 'wallet'
    balance?: number
    color?: string
    icon?: string
    is_active?: boolean
  }) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('accounts')
      .insert(account as any)
      .select()
      .single()
    if (!error) fetchAccounts()
    return { data: data as Account | null, error }
  }

  return { accounts, loading, addAccount, refresh: fetchAccounts }
}

export function useCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},is_default.eq.true`)
    if (!error && data) {
      setCategories(data as unknown as Category[])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const ensureDefaultCategories = async () => {
    if (!user) return
    const { data: existing } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)

    if (!existing || existing.length === 0) {
      const cats = defaultCategories.map(c => ({ ...c, user_id: user.id }))
      await supabase.from('categories').insert(cats as any[])
      fetchCategories()
    }
  }

  return { categories, loading, ensureDefaultCategories, refresh: fetchCategories }
}

export function useProfiles() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfiles = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
    if (!error && data) {
      const typed = data as unknown as Profile[]
      setProfiles(typed)
      const active = typed.find(p => p.is_active)
      if (active) setActiveProfile(active)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const addProfile = async (name: string) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('profiles')
      .insert({ user_id: user.id, name, is_active: false } as any)
      .select()
      .single()
    if (!error) fetchProfiles()
    return { data: data as Profile | null, error }
  }

  const setActive = async (profileId: string) => {
    if (!user) return
    await supabase.from('profiles').update({ is_active: false } as any).eq('user_id', user.id).then(() => {})
    await supabase.from('profiles').update({ is_active: true } as any).eq('id', profileId).then(() => {})
    fetchProfiles()
  }

  return { profiles, activeProfile, loading, addProfile, setActive, refresh: fetchProfiles }
}

export function useUserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (!error && data) {
      setSettings(data as unknown as UserSettings)
    } else {
      const { data: newData, error: createError } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id } as any)
        .select()
        .single()
      if (!createError && newData) setSettings(newData as unknown as UserSettings)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return { error: new Error('Not ready') }
    const { data, error } = await supabase
      .from('user_settings')
      .update(updates as Record<string, unknown>)
      .eq('user_id', user.id)
      .select()
      .single()
    if (!error && data) setSettings(data as unknown as UserSettings)
    return { data: data as UserSettings | null, error }
  }

  return { settings, loading, updateSettings, refresh: fetchSettings }
}

export function useChallenges() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChallenges = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
    if (!error && data) setChallenges(data as unknown as Challenge[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  return { challenges, loading, refresh: fetchChallenges }
}

export function useMonthlyStats(month: Date) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ income: 0, expense: 0, total: 0, count: 0 })
  const [categoryStats, setCategoryStats] = useState<{ name: string; amount: number; color: string }[]>([])

  useEffect(() => {
    if (!user) return
    const fetchStats = async () => {
      const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString().split('T')[0]
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0]

      const { data: txns } = await supabase
        .from('transactions')
        .select('amount, type, category_id, categories(name, color)')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)

      if (txns) {
        const typed = txns as unknown as Transaction[]
        const income = typed.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0)
        const expense = typed.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0)
        setStats({ income, expense, total: income - expense, count: typed.length })

        // Category breakdown for expenses
        const catMap = new Map<string, { name: string; amount: number; color: string }>()
        typed.filter(t => t.type === 'expense').forEach(t => {
          const cat = (t as any).categories
          const key = t.category_id
          const existing = catMap.get(key)
          if (existing) {
            existing.amount += t.amount
          } else {
            catMap.set(key, { name: cat?.name || 'Unknown', amount: t.amount, color: cat?.color || '#6B7280' })
          }
        })
        setCategoryStats(Array.from(catMap.values()).sort((a, b) => b.amount - a.amount))
      }
    }
    fetchStats()
  }, [user, month])

  return { stats, categoryStats }
}

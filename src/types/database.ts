export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      accounts: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name?: string
          type?: 'bank' | 'credit_card' | 'cash' | 'wallet'
          balance?: number
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'bank' | 'credit_card' | 'cash' | 'wallet'
          balance?: number
          color?: string
          icon?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
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
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: 'expense' | 'income'
          icon?: string
          color?: string
          bg_color?: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          type?: 'expense' | 'income'
          icon?: string
          color?: string
          bg_color?: string
          is_default?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          profile_id?: string | null
          account_id?: string | null
          category_id: string
          type: 'expense' | 'income'
          amount: number
          description?: string
          note?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string | null
          account_id?: string | null
          category_id?: string
          type?: 'expense' | 'income'
          amount?: number
          description?: string
          note?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          language?: string
          currency?: string
          theme?: string
          monthly_income?: number | null
          monthly_savings_goal?: number | null
          income_day?: number
          bank_accounts_enabled?: boolean
          payday_reminder?: boolean
          low_balance_alert?: boolean
          savings_goal_alerts?: boolean
          high_expense_alert?: boolean
          bank_balance_reminder?: boolean
          weekly_summary?: boolean
          inactivity_nudge?: boolean
          daily_balance_reminder?: boolean
          spending_milestones?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          currency?: string
          theme?: string
          monthly_income?: number | null
          monthly_savings_goal?: number | null
          income_day?: number
          bank_accounts_enabled?: boolean
          payday_reminder?: boolean
          low_balance_alert?: boolean
          savings_goal_alerts?: boolean
          high_expense_alert?: boolean
          bank_balance_reminder?: boolean
          weekly_summary?: boolean
          inactivity_nudge?: boolean
          daily_balance_reminder?: boolean
          spending_milestones?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      challenges: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          title?: string
          description?: string
          target_days?: number
          current_days?: number
          streak?: number
          days_left?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          target_days?: number
          current_days?: number
          streak?: number
          days_left?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

import { useState, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight, ArrowDown, ArrowUp, Zap,
  Flame, HeartPulse, Trophy, Landmark, CreditCard,
  RefreshCw, Users, Star, Ghost, Handshake,
  TrendingUp
} from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { useTransactions, useAccounts, useChallenges, useUserSettings, useMonthlyStats } from '@/hooks/useData'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { transactions } = useTransactions(currentMonth)
  const { accounts } = useAccounts()
  const { challenges } = useChallenges()
  const { settings } = useUserSettings()
  const { stats } = useMonthlyStats(currentMonth)
  const [noSpendStreak, setNoSpendStreak] = useState(0)
  const [healthScore, setHealthScore] = useState(50)

  useEffect(() => {
    calculateNoSpendStreak()
    calculateHealthScore()
  }, [transactions, stats])

  const calculateNoSpendStreak = () => {
    if (!transactions.length) {
      setNoSpendStreak(0)
      return
    }
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasExpense = transactions.some(t => t.type === 'expense' && t.date === dateStr)
      if (hasExpense) break
      streak++
    }
    setNoSpendStreak(streak)
  }

  const calculateHealthScore = () => {
    if (!settings?.monthly_income || stats.expense === 0) {
      setHealthScore(50)
      return
    }
    const ratio = stats.expense / settings.monthly_income
    if (ratio <= 0.5) setHealthScore(90 + Math.random() * 10)
    else if (ratio <= 0.8) setHealthScore(70 + Math.random() * 20)
    else if (ratio <= 1) setHealthScore(40 + Math.random() * 30)
    else setHealthScore(10 + Math.random() * 30)
  }

  const prevMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() - 1)
    setCurrentMonth(d)
  }

  const nextMonth = () => {
    const d = new Date(currentMonth)
    d.setMonth(d.getMonth() + 1)
    setCurrentMonth(d)
  }

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const dailyAvg = stats.expense / 30
  const savings = settings?.monthly_income
    ? Math.max(0, ((settings.monthly_income - stats.expense) / settings.monthly_income) * 100)
    : 0

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-600' }
    if (score >= 60) return { text: 'Good', color: 'text-green-500' }
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-500' }
    return { text: 'Critical', color: 'text-red-500' }
  }

  const health = getHealthStatus(healthScore)
  const activeChallenge = challenges[0]
  const currency = settings?.currency || 'USD'
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : currency === 'GBP' ? '\u00A3' : '$'

  return (
    <AppLayout>
      {/* Header */}
      <div className="bg-slate-100 px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{getGreeting()}</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Expense & Budget Tracking</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
            <span className="text-[8px] font-bold text-red-500">ADS</span>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button onClick={prevMonth} className="p-2 active:scale-90 transition-transform">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-semibold text-gray-900 min-w-[140px] text-center">{monthYear}</h2>
          <button onClick={nextMonth} className="p-2 active:scale-90 transition-transform">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-2 right-4 text-white/10 text-4xl font-bold">$</div>
          <div className="absolute bottom-8 right-12 text-white/10 text-2xl font-bold">\u20AC</div>
          <div className="absolute top-10 right-20 text-white/10 text-lg font-bold">\u00A3</div>
          
          <p className="text-white/70 text-sm mb-1">Total Balance</p>
          <p className="text-white text-3xl font-bold mb-4">
            {currencySymbol}{(stats.total).toFixed(2)}
          </p>
          
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowDown className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Income</p>
                <p className="text-white font-semibold text-sm">{currencySymbol}{stats.income.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowUp className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Expense</p>
                <p className="text-white font-semibold text-sm">{currencySymbol}{stats.expense.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spend Pulse */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-900" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend Pulse</span>
          </div>
          {!settings?.monthly_income ? (
            <p className="text-gray-400 text-sm text-center py-2">
              Set your monthly income in Settings to activate Spend Pulse
            </p>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">
                {Math.max(0, 100 - (stats.expense / settings.monthly_income) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">of monthly budget remaining</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* No-Spend Streak */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-500">{noSpendStreak}</p>
            <p className="text-sm font-medium text-gray-700">No-Spend Streak</p>
            <p className="text-xs text-gray-400">Best: {noSpendStreak} days</p>
          </div>

          {/* Health Score */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-500">{Math.round(healthScore)}</p>
            <p className="text-sm font-medium text-gray-700">Health Score</p>
            <p className={`text-xs font-medium ${health.color}`}>{health.text}</p>
          </div>
        </div>

        {/* Active Challenge */}
        {activeChallenge && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Active Challenge</p>
                  <p className="text-sm font-semibold text-gray-900">{activeChallenge.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-lg font-bold text-amber-500">{activeChallenge.streak}</span>
                <span className="text-[10px] text-gray-500 uppercase">Streak</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all"
                style={{ width: `${(activeChallenge.current_days / activeChallenge.target_days) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{activeChallenge.current_days}/{activeChallenge.target_days} days</span>
              <span className="text-xs text-gray-500">{activeChallenge.days_left}d left</span>
            </div>
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-[10px] text-gray-500 uppercase">Daily Avg</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{currencySymbol}{dailyAvg.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-[10px] text-gray-500 uppercase">Savings</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{savings.toFixed(0)}%</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-blue-900 rounded-full" />
              <span className="text-[10px] text-gray-500 uppercase">Txns</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{stats.count}</p>
          </div>
        </div>

        {/* Accounts Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map(account => (
              <div key={account.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: account.color + '20' }}>
                    {account.type === 'bank' ? <Landmark className="w-4 h-4" style={{ color: account.color }} /> :
                     account.type === 'credit_card' ? <CreditCard className="w-4 h-4" style={{ color: account.color }} /> :
                     <TrendingUp className="w-4 h-4" style={{ color: account.color }} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">{account.name}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{currencySymbol}{account.balance.toFixed(2)}</p>
              </div>
            ))}
            {accounts.length === 0 && (
              <>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Landmark className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Bank Account</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{currencySymbol}0.00</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Credit Card</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{currencySymbol}0.00</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recurring Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recurring</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: RefreshCw, label: 'Subscriptions', desc: 'No active subs', color: 'bg-purple-100 text-purple-600' },
              { icon: Landmark, label: 'Fixed Payments', desc: 'No fixed bills', color: 'bg-green-100 text-green-600' },
              { icon: Users, label: 'Split Bill', desc: 'No splits yet', color: 'bg-blue-100 text-blue-600' },
              { icon: Star, label: 'Wishlist', desc: 'No wishes yet', color: 'bg-yellow-100 text-yellow-600' },
              { icon: Ghost, label: 'Ghost Budget', desc: 'Tap to set up', color: 'bg-gray-100 text-gray-600' },
              { icon: Handshake, label: 'Owe & Lend', desc: 'No active debts', color: 'bg-red-100 text-red-600' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 ${item.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} />
                  </div>
                  <span className="text-lg font-bold text-gray-400">0</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

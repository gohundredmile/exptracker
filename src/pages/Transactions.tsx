import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Sigma,
  Receipt
} from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { useTransactions, useMonthlyStats } from '@/hooks/useData'
import { useUserSettings } from '@/hooks/useData'

export default function Transactions() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all')
  const { transactions, loading } = useTransactions(currentMonth)
  const { stats } = useMonthlyStats(currentMonth)
  const { settings } = useUserSettings()

  const currency = settings?.currency || 'USD'
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : currency === 'GBP' ? '\u00A3' : '$'

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

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

  // Group transactions by date
  const grouped = filteredTransactions.reduce((groups, t) => {
    const date = t.date
    if (!groups[date]) groups[date] = []
    groups[date].push(t)
    return groups
  }, {} as Record<string, typeof transactions>)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <AppLayout>
      <div className="bg-slate-100 px-4 pt-4 pb-2">
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button onClick={prevMonth} className="p-2 active:scale-90 transition-transform">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-semibold text-gray-900 min-w-[140px] text-center">{monthYear}</h2>
          <button onClick={nextMonth} className="p-2 active:scale-90 transition-transform">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase">Income</span>
            </div>
            <p className="text-sm font-bold text-green-600">{currencySymbol}{stats.income.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase">Expense</span>
            </div>
            <p className="text-sm font-bold text-red-500">{currencySymbol}{stats.expense.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                <Sigma className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[10px] text-gray-500 uppercase">Total</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{currencySymbol}{stats.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-1.5 flex shadow-sm">
          {(['all', 'expense', 'income'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-blue-900 text-white' : 'text-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Count */}
      <div className="px-4 mb-2">
        <p className="text-xs text-gray-500">{filteredTransactions.length} transactions</p>
      </div>

      {/* Transaction List */}
      <div className="px-4 pb-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-500 mb-1">No transactions yet</p>
            <p className="text-sm text-gray-400 text-center">Tap the + button to add your first transaction</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs text-gray-500 mb-2">{formatDate(date)}</p>
              <div className="space-y-2">
                {items.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">
                        {t.type === 'expense' ? '\uD83D\uDED2' : '\uD83D\uDCB5'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{t.description}</p>
                      <p className="text-xs text-gray-400">{t.note || t.type}</p>
                    </div>
                    <p className={`text-sm font-semibold ${t.type === 'expense' ? 'text-red-500' : 'text-green-600'}`}>
                      {t.type === 'expense' ? '-' : '+'}{currencySymbol}{t.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  )
}

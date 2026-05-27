import { useState, useMemo } from 'react'
import { Filter, Calendar } from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { useMonthlyStats } from '@/hooks/useData'
import { useUserSettings } from '@/hooks/useData'

export default function Statistics() {
  const [currentMonth] = useState(new Date())
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'total'>('monthly')
  const { stats, categoryStats } = useMonthlyStats(currentMonth)
  const { settings } = useUserSettings()

  const currency = settings?.currency || 'USD'
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : currency === 'GBP' ? '\u00A3' : '$'
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const totalExpense = stats.expense

  // Donut chart segments
  const chartSegments = useMemo(() => {
    if (!categoryStats.length) return []
    let cumulative = 0
    return categoryStats.map(cat => {
      const percentage = (cat.amount / totalExpense) * 100
      const startAngle = (cumulative / 100) * 360
      cumulative += percentage
      const endAngle = (cumulative / 100) * 360
      return { ...cat, percentage, startAngle, endAngle }
    })
  }, [categoryStats, totalExpense])

  // SVG donut chart
  const describeArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const start = { x: 100 + outerR * Math.cos(toRad(startAngle - 90)), y: 100 + outerR * Math.sin(toRad(startAngle - 90)) }
    const end = { x: 100 + outerR * Math.cos(toRad(endAngle - 90)), y: 100 + outerR * Math.sin(toRad(endAngle - 90)) }
    const innerStart = { x: 100 + innerR * Math.cos(toRad(endAngle - 90)), y: 100 + innerR * Math.sin(toRad(endAngle - 90)) }
    const innerEnd = { x: 100 + innerR * Math.cos(toRad(startAngle - 90)), y: 100 + innerR * Math.sin(toRad(startAngle - 90)) }
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y} L ${innerStart.x} ${innerStart.y} A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`
  }

  return (
    <AppLayout>
      <div className="bg-slate-100 px-4 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="p-2">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Statistics</h1>
          <button className="p-2">
            <Calendar className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex justify-center mb-4">
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-medium text-blue-900">{monthYear}</span>
          </button>
        </div>

        {/* Period Tabs */}
        <div className="flex justify-center gap-6 mb-4">
          {(['daily', 'weekly', 'monthly', 'total'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-sm font-medium capitalize pb-1 border-b-2 transition-all ${
                period === p ? 'text-blue-900 border-blue-900' : 'text-gray-400 border-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Total Spending */}
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Total Spending ({period})
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {currencySymbol}{stats.expense.toFixed(2)}
          </p>
        </div>

        {/* Chart Area */}
        {categoryStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-32 h-32 relative mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="30" />
                <line x1="100" y1="30" x2="100" y2="170" stroke="#D1D5DB" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-500 mb-1">No expense data</p>
            <p className="text-sm text-gray-400 text-center">Add some expenses to see your analytics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Donut Chart */}
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 relative flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {chartSegments.map((seg, i) => (
                    <path
                      key={i}
                      d={describeArc(seg.startAngle, seg.endAngle, 50, 80)}
                      fill={seg.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-gray-500">Expense</p>
                  <p className="text-lg font-bold text-gray-900">{currencySymbol}{stats.expense.toFixed(0)}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-2">
                {categoryStats.slice(0, 5).map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-gray-600 flex-1">{cat.name}</span>
                    <span className="text-xs font-medium text-gray-900">
                      {((cat.amount / totalExpense) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Structure Detail */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Expense Structure</h3>
              <div className="space-y-2">
                {categoryStats.map((cat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-gray-700 flex-1">{cat.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{currencySymbol}{cat.amount.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 w-12 text-right">{((cat.amount / totalExpense) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

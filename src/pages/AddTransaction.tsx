import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowUp, ArrowDown, Calendar, Clock, Landmark, User, Plus, Pencil,
  Wine, Scissors, FileText, Car, Cigarette, Shirt, GraduationCap,
  Monitor, Gamepad2, UtensilsCrossed, ShoppingCart, HeartPulse,
  Home, Shield, Banknote, Laptop, TrendingUp, Gift, Coins
} from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { useCategories, useTransactions } from '@/hooks/useData'

const expenseIcons: Record<string, React.ElementType> = {
  'Alcohol': Wine, 'Beauty': Scissors, 'Bills': FileText, 'Car': Car,
  'Cigarettes': Cigarette, 'Clothing': Shirt, 'Donations': HandIcon,
  'Education': GraduationCap, 'Electronics': Monitor, 'Entertainment': Gamepad2,
  'Food': UtensilsCrossed, 'Groceries': ShoppingCart, 'Health': HeartPulse,
  'Housing': Home, 'Insurance': Shield,
}

const incomeIcons: Record<string, React.ElementType> = {
  'Salary': Banknote, 'Freelance': Laptop, 'Investments': TrendingUp,
  'Gifts': Gift, 'Other Income': Coins,
}

function HandIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 12.5V10a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4"/>
      <path d="M14 11V9a2 2 0 1 0-4 0v2"/>
      <path d="M10 10.5V6a2 2 0 1 0-4 0v8"/>
      <path d="M16 12a2 2 0 1 0-2 2"/>
      <path d="M20 15a4 4 0 0 1-4 4h-2.1a.5.5 0 0 0-.5.5v0a.5.5 0 0 0 .5.5H16a2 2 0 0 1 2 2v0"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5.3a2 2 0 0 1 2.3-2l1.5-.3a1 1 0 0 1 1.2 1V18z"/>
    </svg>
  )
}

export default function AddTransaction() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { categories } = useCategories()
  const { addTransaction } = useTransactions()

  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  const filteredCategories = categories.filter(c => c.type === type)

  const getCategoryIcon = (name: string, type: 'expense' | 'income') => {
    const icons = type === 'expense' ? expenseIcons : incomeIcons
    const Icon = icons[name] || (type === 'expense' ? ShoppingCart : Coins)
    return Icon
  }

  const handleAmountInput = (key: string) => {
    if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1))
    } else if (key === '.' && !amount.includes('.')) {
      setAmount(prev => prev + '.')
    } else if (/\d/.test(key)) {
      if (amount.includes('.') && amount.split('.')[1].length >= 2) return
      setAmount(prev => prev + key)
    }
  }

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0 || !selectedCategory || !user) return

    setSaving(true)
    const { error } = await addTransaction({
      user_id: user.id,
      category_id: selectedCategory,
      type,
      amount: parseFloat(amount),
      description: note || (type === 'expense' ? 'Expense' : 'Income'),
      note: note || null,
      date,
      account_id: null,
      profile_id: null,
    })
    setSaving(false)

    if (!error) {
      navigate('/')
    }
  }

  const todayFormatted = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <AppLayout hideNav>
      <div className="bg-slate-100 min-h-screen">
        {/* Header */}
        <div className="bg-slate-100 px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-gray-900 text-center">Add Transaction</h1>
        </div>

        <div className="px-4 space-y-4 pb-8">
          {/* Type Toggle */}
          <div className="bg-white rounded-2xl p-1.5 flex shadow-sm">
            <button
              onClick={() => setType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                type === 'expense' ? 'bg-red-500 text-white' : 'text-gray-500'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              Expense
            </button>
            <button
              onClick={() => setType('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                type === 'income' ? 'bg-green-500 text-white' : 'text-gray-500'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider text-center mb-2">Amount</p>
            <div className="flex items-center justify-center gap-1">
              <span className={`text-2xl font-bold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>$</span>
              <span className={`text-4xl font-bold ${amount ? 'text-gray-900' : 'text-gray-300'}`}>
                {amount || '0.00'}
              </span>
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2">
            {['1','2','3','4','5','6','7','8','9','.','0','backspace'].map((key) => (
              <button
                key={key}
                onClick={() => handleAmountInput(key)}
                className="bg-white rounded-xl py-4 text-lg font-semibold text-gray-900 shadow-sm active:bg-gray-100 transition-colors"
              >
                {key === 'backspace' ? '\u232B' : key}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{todayFormatted}</p>
            </div>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="absolute opacity-0 w-full h-full inset-0 cursor-pointer"
            />
          </div>

          {/* Schedule for Later */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Schedule for Later</p>
              <p className="text-xs text-gray-400">Plan a future expense</p>
            </div>
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
          </div>

          {/* Pay from Account */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Landmark className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Pay from Account</p>
              <p className="text-xs text-gray-400">Select a bank or card to track</p>
            </div>
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
          </div>

          {/* Paid For */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid For</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
                <User className="w-4 h-4" />
                Personal
              </button>
              <button className="flex items-center gap-2 border-2 border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-medium">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</span>
              <button className="flex items-center gap-1 text-blue-900 text-sm">
                <Pencil className="w-3 h-3" />
                Manage
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                {filteredCategories.map(cat => {
                  const Icon = getCategoryIcon(cat.name, type)
                  const isSelected = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                        isSelected ? 'bg-blue-50 ring-2 ring-blue-900' : ''
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: cat.bg_color }}
                      >
                        <Icon className="w-6 h-6" style={{ color: cat.color }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Note</span>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none resize-none h-16"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0 || !selectedCategory || saving}
            className={`w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all active:scale-[0.98] ${
              type === 'expense'
                ? 'bg-red-500 shadow-red-500/30 disabled:bg-red-300'
                : 'bg-green-500 shadow-green-500/30 disabled:bg-green-300'
            }`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          {/* Cancel */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

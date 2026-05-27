import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  User, Plus, Globe, DollarSign, Moon, Landmark, ChevronRight,
  Banknote, PiggyBank, Calendar, Bell, AlertTriangle, TrendingUp,
  Shield, RefreshCw, BarChart3, Route, LogOut
} from 'lucide-react'
import { AppLayout } from '@/components/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { useProfiles, useUserSettings } from '@/hooks/useData'
import { Switch } from '@/components/ui/switch'

export default function Settings() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { profiles, activeProfile, addProfile, setActive } = useProfiles()
  const { settings, updateSettings } = useUserSettings()
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')

  const toggleSetting = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value } as Partial<import('@/hooks/useData').UserSettings>)
  }

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return
    await addProfile(newProfileName.trim())
    setNewProfileName('')
    setShowAddProfile(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const settingValue = (key: string) => {
    if (!settings) return false
    return (settings as any)[key] ?? false
  }

  return (
    <AppLayout>
      <div className="bg-slate-100 px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Settings</h1>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Profiles Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Profiles</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Active Profile</p>
                <p className="text-base font-semibold text-gray-900">{activeProfile?.name || 'Personal'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            {/* Profile List */}
            {profiles.length > 1 && (
              <div className="border-t border-gray-100 px-4 py-2">
                {profiles.filter(p => !p.is_active).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActive(p.id)}
                    className="w-full text-left py-2 text-sm text-gray-600 hover:text-blue-900"
                  >
                    Switch to {p.name}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddProfile(true)}
              className="w-full p-4 flex items-center justify-center gap-2 border-t border-gray-100 text-blue-900 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Profile
            </button>
          </div>

          {showAddProfile && (
            <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm">
              <input
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                placeholder="Profile name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-blue-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddProfile}
                  className="flex-1 bg-blue-900 text-white py-2.5 rounded-xl text-sm font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddProfile(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* General Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">General</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Language</p>
                <p className="text-xs text-gray-500">\uD83C\uDDFA\uD83C\uDDF8 English</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Currency</p>
                <p className="text-xs text-gray-500">\uD83C\uDDFA\uD83C\uDDF8 {settings?.currency || 'USD'} ({settings?.currency === 'EUR' ? '\u20AC' : settings?.currency === 'GBP' ? '\u00A3' : '$'})</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Theme</p>
                <p className="text-xs text-gray-500">{settings?.theme || 'System Default'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Bank Management */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bank Management</p>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Bank Accounts</p>
                <p className="text-xs text-gray-500">Track balances across multiple accounts</p>
              </div>
              <Switch
                checked={settingValue('bank_accounts_enabled')}
                onCheckedChange={v => toggleSetting('bank_accounts_enabled', v)}
              />
            </div>
          </div>
        </div>

        {/* Income & Reminders */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Income & Reminders</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Banknote className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly Income</p>
                <p className="text-xs text-gray-500">{settings?.monthly_income ? `$${settings.monthly_income}` : 'Not set'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly Savings Goal</p>
                <p className="text-xs text-gray-500">{settings?.monthly_savings_goal ? `$${settings.monthly_savings_goal}` : 'Not set'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Income Day</p>
                <p className="text-xs text-gray-500">{settings?.income_day || 1}st of every month</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Payday Reminder</p>
                <p className="text-xs text-gray-500">Get notified on your income day</p>
              </div>
              <Switch
                checked={settingValue('payday_reminder')}
                onCheckedChange={v => toggleSetting('payday_reminder', v)}
              />
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Low Balance Alert</p>
                <p className="text-xs text-gray-500">Alert when 10% of income left</p>
              </div>
              <Switch
                checked={settingValue('low_balance_alert')}
                onCheckedChange={v => toggleSetting('low_balance_alert', v)}
              />
            </div>
          </div>
        </div>

        {/* Engagement Notifications */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Engagement Notifications</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Savings Goal Alerts</p>
                <p className="text-xs text-gray-500">Notify when savings goal is reached or at risk</p>
              </div>
              <Switch
                checked={settingValue('savings_goal_alerts')}
                onCheckedChange={v => toggleSetting('savings_goal_alerts', v)}
              />
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">High Expense Alert</p>
                <p className="text-xs text-gray-500">Alert when spending exceeds 80% of income</p>
              </div>
              <Switch
                checked={settingValue('high_expense_alert')}
                onCheckedChange={v => toggleSetting('high_expense_alert', v)}
              />
            </div>
          </div>
        </div>

        {/* Smart Reminders */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Smart Reminders</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {[
              { key: 'bank_balance_reminder', icon: Landmark, color: 'bg-blue-100 text-blue-600', title: 'Bank Balance Reminder', desc: 'Daily reminder to verify your account balances' },
              { key: 'weekly_summary', icon: RefreshCw, color: 'bg-purple-100 text-purple-600', title: 'Weekly Summary', desc: "Every Sunday: recap of the week's spending" },
              { key: 'inactivity_nudge', icon: Bell, color: 'bg-amber-100 text-amber-600', title: 'Inactivity Nudge', desc: 'Remind to log spending after 3 days away' },
              { key: 'daily_balance_reminder', icon: Shield, color: 'bg-green-100 text-green-600', title: 'Daily Balance Reminder', desc: 'Every morning: your balance & daily spend target' },
              { key: 'spending_milestones', icon: BarChart3, color: 'bg-red-100 text-red-600', title: 'Spending Milestones', desc: 'Alert at 50%, 80% and 100% of monthly budget' },
            ].map(item => (
              <div key={item.key} className="p-4 flex items-center gap-3 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 ${item.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color.split(' ')[1]}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Switch
                  checked={settingValue(item.key)}
                  onCheckedChange={v => toggleSetting(item.key as any, v)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Help</p>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Route className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Replay Tutorial</p>
                <p className="text-xs text-gray-500">Guided tour of all features</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data</p>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 text-red-500"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

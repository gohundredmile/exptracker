import React, { useState } from 'react';
import { useData } from '../lib/dataContext';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { 
  User, 
  Plus, 
  Globe, 
  DollarSign, 
  Moon, 
  Building, 
  DollarSign as CashIcon, 
  PiggyBank, 
  CalendarDays, 
  Bell, 
  AlertTriangle, 
  HelpCircle, 
  Trash2,
  Database,
  Link,
  Copy,
  Check,
  UserCheck2,
  ChevronRight
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    profiles, 
    activeProfile, 
    settings, 
    isSupabaseConnected, 
    supabaseUrl, 
    supabaseAnonKey,
    addProfile, 
    selectProfile, 
    updateSettings, 
    updateSupabaseCredentials, 
    resetAll 
  } = useData();

  // State triggers
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  
  // Credentials edit inputs
  const [editUrl, setEditUrl] = useState(supabaseUrl);
  const [editKey, setEditKey] = useState(supabaseAnonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  // Settings numeric fields edit inline state
  const [incomeEdit, setIncomeEdit] = useState(settings.monthlyIncome > 0 ? settings.monthlyIncome.toString() : '');
  const [savingsEdit, setSavingsEdit] = useState(settings.monthlySavingsGoal > 0 ? settings.monthlySavingsGoal.toString() : '');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileNameInput) return;
    await addProfile(profileNameInput);
    setProfileNameInput('');
    setShowAddProfile(false);
  };

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(editUrl, editKey);
    alert('Supabase credentials saved successfully! Reloading configuration...');
  };

  const copySchemaToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleIncomeBlur = () => {
    const val = parseFloat(incomeEdit) || 0;
    updateSettings({ monthlyIncome: val });
  };

  const handleSavingsBlur = () => {
    const val = parseFloat(savingsEdit) || 0;
    updateSettings({ monthlySavingsGoal: val });
  };

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="pb-28 pt-4 px-4 bg-[#F8FAFC]">
      {/* Settings Header */}
      <h2 className="text-sm font-black text-slate-800 tracking-tight text-center uppercase mb-6">Settings</h2>

      {/* 1. PROFILES SECTION */}
      <div className="mb-5">
        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-widest pl-1 mb-2.5">Profiles</span>
        
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          {/* Active Profile block */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Active Profile</span>
                <span className="text-[10px] text-slate-400 font-semibold">{activeProfile?.name} Selected</span>
              </div>
            </div>

            <select 
              value={activeProfile?.id}
              onChange={(e) => selectProfile(e.target.value)}
              className="text-xs font-bold text-indigo-600 bg-indigo-50/50 rounded-lg px-3 py-1 focus:outline-none border-0"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  👤 {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Profile container switch */}
          {showAddProfile ? (
            <form onSubmit={handleSaveProfile} className="pt-2 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="e.g. Brother, Personal, Rana"
                  required
                  value={profileNameInput}
                  onChange={(e) => setProfileNameInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-indigo-950 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-indigo-900 transition"
                >
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddProfile(false)}
                  className="p-1 px-1.5 text-slate-400 hover:text-slate-600 font-black text-xs"
                >
                  ✕
                </button>
              </div>
            </form>
          ) : (
            <button 
              id="btn_add_new_profile_section"
              onClick={() => setShowAddProfile(true)}
              className="w-full text-left py-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1.5 mt-2 hover:underline"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Profile
            </button>
          )}
        </div>
      </div>

      {/* 2. GENERAL SECTION */}
      <div className="mb-5">
        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-widest pl-1 mb-2.5">General</span>
        
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          {/* Language selection option */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Language</span>
                <span className="text-[10px] text-slate-400 font-semibold">Select default UI text dialect</span>
              </div>
            </div>
            
            <select 
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="text-xs font-bold text-purple-600 bg-purple-50/50 rounded-lg px-2 py-1 border-0"
            >
              <option value="English">🇺🇸 English</option>
              <option value="Bangla">🇧🇩 Bangla</option>
              <option value="Spanish">🇪🇸 Español</option>
              <option value="Hindi">🇮🇳 Hindi</option>
            </select>
          </div>

          {/* Currency configuration */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Currency</span>
                <span className="text-[10px] text-slate-400 font-semibold">Global conversion symbol</span>
              </div>
            </div>
            
            <select 
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="text-xs font-bold text-orange-500 bg-orange-50/50 rounded-lg px-2.5 py-1 border-0"
            >
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Theme custom picker */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <Moon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Theme</span>
                <span className="text-[10px] text-slate-400 font-semibold">Dynamic visual light styles</span>
              </div>
            </div>

            <select 
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value })}
              className="text-xs font-bold text-sky-600 bg-sky-50/50 rounded-lg px-2.5 py-1 border-0"
            >
              <option value="System Default">💻 System Default</option>
              <option value="Light Mode">☀️ Light Theme</option>
              <option value="Dark Mode">🌙 Midnight Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. INCOME & BUDGET GOALS */}
      <div className="mb-5">
        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-widest pl-1 mb-2.5">Income & Reminders</span>
        
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          {/* Monthly Income Field */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CashIcon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Monthly Income</span>
                <span className="text-[10px] text-slate-400 font-semibold">Activates Spend Pulse</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 text-xs font-bold">$</span>
              <input 
                type="number" 
                placeholder="Not set"
                value={incomeEdit}
                onChange={(e) => setIncomeEdit(e.target.value)}
                onBlur={handleIncomeBlur}
                className="w-20 bg-slate-50 text-right focus:bg-white border focus:border-indigo-150 rounded px-2 py-0.5 text-xs font-bold text-emerald-600"
              />
            </div>
          </div>

          {/* Monthly Savings Goal */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500">
                <PiggyBank className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Monthly Savings Goal</span>
                <span className="text-[10px] text-slate-400 font-semibold">Target reserve amount</span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 text-xs font-bold">$</span>
              <input 
                type="number" 
                placeholder="Not set"
                value={savingsEdit}
                onChange={(e) => setSavingsEdit(e.target.value)}
                onBlur={handleSavingsBlur}
                className="w-20 bg-slate-50 text-right focus:bg-white border focus:border-indigo-150 rounded px-2 py-0.5 text-xs font-bold text-sky-600"
              />
            </div>
          </div>

          {/* Income Day Selector */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <CalendarDays className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Income Day</span>
                <span className="text-[10px] text-slate-400 font-semibold">{settings.incomeDay}st of every month</span>
              </div>
            </div>

            <select 
              value={settings.incomeDay}
              onChange={(e) => updateSettings({ incomeDay: parseInt(e.target.value) || 1 })}
              className="text-xs font-bold text-sky-600 focus:outline-none"
            >
              {[1, 5, 10, 15, 25, 28].map(day => (
                <option key={day} value={day}>{day}th of month</option>
              ))}
            </select>
          </div>

          {/* Payday Reminder Switch */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-5 flex items-center justify-center text-yellow-500">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Payday Reminder</span>
                <span className="text-[10px] text-slate-400 font-semibold">Get notified on your income day</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => handleToggle('paydayReminder')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.paydayReminder ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.paydayReminder ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Low Balance Alert switch */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50/55 flex items-center justify-center text-rose-500">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700">Low Balance Alert</span>
                <span className="text-[10px] text-slate-400 font-semibold">Alert when 10% of income left</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => handleToggle('lowBalanceAlert')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.lowBalanceAlert ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.lowBalanceAlert ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. ENGAGEMENT NOTIFICATIONS SECTION */}
      <div className="mb-5">
        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-widest pl-1 mb-2.5">Engagement Notifications</span>
        
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          {/* Savings Goal alert */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">Savings Goal Alerts</span>
            <button 
              type="button"
              onClick={() => handleToggle('savingsGoalAlerts')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.savingsGoalAlerts ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.savingsGoalAlerts ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* High Expense Alert */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">High Expense Alert</span>
            <button 
              type="button"
              onClick={() => handleToggle('highExpenseAlert')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.highExpenseAlert ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.highExpenseAlert ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Bank balance reminder */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">Bank Balance Reminder</span>
            <button 
              type="button"
              onClick={() => handleToggle('bankBalanceReminder')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.bankBalanceReminder ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.bankBalanceReminder ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Weekly Summary */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">Weekly Summary</span>
            <button 
              type="button"
              onClick={() => handleToggle('weeklySummary')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.weeklySummary ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.weeklySummary ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Inactivity nudge */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">Inactivity Nudge</span>
            <button 
              type="button"
              onClick={() => handleToggle('inactivityNudge')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.inactivityNudge ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.inactivityNudge ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Daily balance reminder */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-xs font-bold text-slate-700">Daily Balance Reminder</span>
            <button 
              type="button"
              onClick={() => handleToggle('dailyBalanceReminder')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.dailyBalanceReminder ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.dailyBalanceReminder ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>

          {/* Spending Milestone alerts */}
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700">Spending Milestones</span>
            <button 
              type="button"
              onClick={() => handleToggle('spendingMilestones')}
              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 ${
                settings.spendingMilestones ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                settings.spendingMilestones ? 'translate-x-[18px]' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. DYNAMIC SUPABASE CONFIGURATION GATEWAY */}
      <div className="mb-5">
        <span className="block text-xs font-bold text-[#64748B] uppercase tracking-widest pl-1 mb-2.5 flex items-center space-x-1.5 text-indigo-700">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span>Supabase Sync Configuration</span>
        </span>

        <div className="bg-white rounded-3xl p-5 border border-indigo-50 shadow-sm space-y-4">
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            By integrating Supabase, the applet automatically handles continuous real-time synchronization of transactions, profiles, recurring items, and balances, storing them in your personal repository.
          </p>

          <form onSubmit={handleUpdateCreds} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Supabase API URL</label>
              <input 
                type="text" 
                placeholder="https://xyzabcdefg.supabase.co"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Anon Keys</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={editKey}
                onChange={(e) => setEditKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:bg-white"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-950 font-bold hover:bg-neutral-900 text-white rounded-xl py-2 text-xs transition duration-150 shadow-sm"
            >
              Save & Test connection
            </button>
          </form>

          {/* Postgres SQL schema script with click copy feature */}
          <div className="bg-slate-950 rounded-2xl p-4 text-white overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8]">Database SQL Script</span>
              <button 
                onClick={copySchemaToClipboard}
                className="text-white hover:text-indigo-400 transition flex items-center space-x-1 py-1 px-2.5 rounded bg-white/10 hover:bg-white/15"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-[9px] text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-300" />
                    <span className="text-[9px] text-slate-300 font-semibold">Copy Script</span>
                  </>
                )}
              </button>
            </div>
            
            <pre className="text-[8.5px] font-mono leading-relaxed max-h-36 overflow-y-auto text-slate-300 pointer-events-auto select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      </div>

      {/* HELP AND WIPT DATA MODULE */}
      <div className="space-y-3.5">
        <button 
          onClick={() => {
            alert("No Spend Day Challenge: Keep logging days you don't spend. Spend Pulse: Enter your monthly income first. Supabase: Hook up your tables using our SQL script.");
          }}
          className="w-full bg-white border border-slate-100 rounded-2xl py-3 px-4 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50"
        >
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-4.5 h-4.5 text-[#64748B]" />
            <span className="font-bold">Replay Tutorial / View Guide</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>

        <button 
          onClick={() => {
            if (confirm('Are you absolutely sure you want to reset all data and clear your local storage backup?')) {
              resetAll();
              alert('Application cleared and re-seeded with dynamic mock templates.');
              window.location.reload();
            }
          }}
          className="w-full bg-rose-50 border border-rose-100 rounded-2xl py-3 px-4 flex items-center justify-between text-xs text-rose-600 hover:bg-rose-100/60"
        >
          <div className="flex items-center space-x-2.5">
            <Trash2 className="w-4.5 h-4.5 text-rose-500" />
            <span className="font-extrabold uppercase tracking-wider">Reset App Statistics</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>
    </div>
  );
};
export default SettingsView;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Account, Transaction, RecurringItem, Challenge, UserSettings } from '../types';
import { 
  INITIAL_PROFILES, 
  INITIAL_ACCOUNTS, 
  INITIAL_CATEGORIES, 
  INITIAL_RECURRING_ITEMS, 
  INITIAL_CHALLENGE, 
  INITIAL_SETTINGS 
} from './mockData';
import { getSupabaseCredentials, supabase } from './supabase';

interface DataContextType {
  profiles: Profile[];
  activeProfile: Profile;
  accounts: Account[];
  transactions: Transaction[];
  recurringItems: RecurringItem[];
  challenge: Challenge;
  settings: UserSettings;
  isSupabaseConnected: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addAccount: (acc: Omit<Account, 'id'>) => Promise<void>;
  updateAccountBalance: (id: string, newBalance: number) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  addProfile: (name: string) => Promise<void>;
  selectProfile: (id: string) => Promise<void>;
  updateChallenge: (newChallenge: Partial<Challenge>) => Promise<void>;
  updateRecurringItem: (id: string, updates: Partial<RecurringItem>) => Promise<void>;
  updateSupabaseCredentials: (url: string, key: string) => void;
  resetAll: () => void;
  getCurrencySymbol: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const stored = localStorage.getItem('expenses_profiles');
      return stored ? JSON.parse(stored) : INITIAL_PROFILES;
    } catch (e) {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfile, setActiveProfile] = useState<Profile>(() => {
    try {
      const stored = localStorage.getItem('expenses_active_profile');
      return stored ? JSON.parse(stored) : INITIAL_PROFILES[0];
    } catch (e) {
      return INITIAL_PROFILES[0];
    }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const stored = localStorage.getItem('expenses_accounts');
      return stored ? JSON.parse(stored) : INITIAL_ACCOUNTS;
    } catch (e) {
      return INITIAL_ACCOUNTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem('expenses_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [recurringItems, setRecurringItems] = useState<RecurringItem[]>(() => {
    try {
      const stored = localStorage.getItem('expenses_recurring');
      return stored ? JSON.parse(stored) : INITIAL_RECURRING_ITEMS;
    } catch (e) {
      return INITIAL_RECURRING_ITEMS;
    }
  });

  const [challenge, setChallenge] = useState<Challenge>(() => {
    try {
      const stored = localStorage.getItem('expenses_challenge');
      return stored ? JSON.parse(stored) : INITIAL_CHALLENGE;
    } catch (e) {
      return INITIAL_CHALLENGE;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('expenses_settings');
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  });
  
  // Supabase states
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Load configuration and credentials on mount
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseAnonKey(creds.key);
    
    if (creds.url && creds.key && creds.url !== 'YOUR_SUPABASE_URL') {
      setIsSupabaseConnected(true);
    }

    // Load from localStorage or Supabase
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const creds = getSupabaseCredentials();
    const hasSupabase = creds.url && creds.key && creds.url !== 'YOUR_SUPABASE_URL';

    if (hasSupabase && supabase) {
      try {
        // Fetch Profiles
        const { data: dbProfiles, error: pErr } = await supabase.from('expenses_profiles').select('*');
        if (dbProfiles && dbProfiles.length > 0) {
          setProfiles(dbProfiles);
          const active = dbProfiles.find((p: Profile) => p.is_default) || dbProfiles[0];
          setActiveProfile(active);
        } else {
          // Sync existing to DB
          await supabase.from('expenses_profiles').insert(INITIAL_PROFILES);
        }

        // Fetch Accounts
        const { data: dbAccounts, error: aErr } = await supabase.from('expenses_accounts').select('*');
        if (dbAccounts && dbAccounts.length > 0) {
          setAccounts(dbAccounts);
        } else {
          await supabase.from('expenses_accounts').insert(INITIAL_ACCOUNTS);
        }

        // Fetch Transactions
        const { data: dbTransactions } = await supabase.from('expenses_transactions').select('*');
        if (dbTransactions) {
          setTransactions(dbTransactions);
        }

        // Fetch Recurring
        const { data: dbRec } = await supabase.from('expenses_recurring').select('*');
        if (dbRec && dbRec.length > 0) {
          setRecurringItems(dbRec);
        } else {
          await supabase.from('expenses_recurring').insert(INITIAL_RECURRING_ITEMS);
        }

        // Fetch Challenge
        const { data: dbChal } = await supabase.from('expenses_challenge').select('*');
        if (dbChal && dbChal.length > 0) {
          setChallenge(dbChal[0]);
        } else {
          await supabase.from('expenses_challenge').insert([INITIAL_CHALLENGE]);
        }

        // Load Settings from localStorage
        const storedSettings = localStorage.getItem('expenses_settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage:', err);
        fallbackToLocalStorage();
      }
    } else {
      fallbackToLocalStorage();
    }
  };

  const fallbackToLocalStorage = () => {
    const storedProfiles = localStorage.getItem('expenses_profiles');
    const storedActive = localStorage.getItem('expenses_active_profile');
    const storedAccounts = localStorage.getItem('expenses_accounts');
    const storedTransactions = localStorage.getItem('expenses_transactions');
    const storedRecurring = localStorage.getItem('expenses_recurring');
    const storedChallenge = localStorage.getItem('expenses_challenge');
    const storedSettings = localStorage.getItem('expenses_settings');

    if (storedProfiles) setProfiles(JSON.parse(storedProfiles));
    if (storedActive) setActiveProfile(JSON.parse(storedActive));
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedRecurring) setRecurringItems(JSON.parse(storedRecurring));
    if (storedChallenge) setChallenge(JSON.parse(storedChallenge));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  };

  // Sync to localstorage whenever state changes (double safety backup)
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('expenses_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('expenses_active_profile', JSON.stringify(activeProfile));
  }, [activeProfile]);

  useEffect(() => {
    localStorage.setItem('expenses_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('expenses_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('expenses_recurring', JSON.stringify(recurringItems));
  }, [recurringItems]);

  useEffect(() => {
    localStorage.setItem('expenses_challenge', JSON.stringify(challenge));
  }, [challenge]);

  useEffect(() => {
    localStorage.setItem('expenses_settings', JSON.stringify(settings));
  }, [settings]);

  // Currency utility helper
  const getCurrencySymbol = () => {
    // If active profile is Rana, force BDT (৳) as show in image!
    if (activeProfile?.name?.toLowerCase() === 'rana') {
      return '৳';
    }
    
    switch (settings.currency) {
      case 'BDT': return '৳';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'USD':
      default: return '$';
    }
  };

  // Actions implementation
  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now()
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update the associated account balance
    const change = tx.type === 'expense' ? -tx.amount : tx.amount;
    await updateAccountBalance(tx.pay_from_account_id, change);

    // Sync to Supabase
    if (isSupabaseConnected && supabase) {
      try {
        await supabase.from('expenses_transactions').insert([newTx]);
      } catch (err) {
        console.warn('Supabase add tx fail:', err);
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    const txToDelete = transactions.find(t => t.id === id);
    if (!txToDelete) return;

    setTransactions(prev => prev.filter(t => t.id !== id));

    // Revert balance change
    const rbChange = txToDelete.type === 'expense' ? txToDelete.amount : -txToDelete.amount;
    await updateAccountBalance(txToDelete.pay_from_account_id, rbChange);

    if (isSupabaseConnected && supabase) {
      try {
        await supabase.from('expenses_transactions').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete tx fail:', err);
      }
    }
  };

  const addAccount = async (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = {
      ...acc,
      id: 'acc_' + Date.now()
    };

    setAccounts(prev => [...prev, newAcc]);

    if (isSupabaseConnected && supabase) {
      try {
        await supabase.from('expenses_accounts').insert([newAcc]);
      } catch (err) {
        console.warn('Supabase account insert fail:', err);
      }
    }
  };

  const updateAccountBalance = async (id: string, delta: number) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const newerBal = Number((acc.balance + delta).toFixed(2));
        
        // Sync single account to Supabase
        if (isSupabaseConnected && supabase) {
          supabase.from('expenses_accounts').update({ balance: newerBal }).eq('id', id).then();
        }

        return { ...acc, balance: newerBal };
      }
      return acc;
    }));
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const addProfile = async (name: string) => {
    const newProfile: Profile = {
      id: 'prof_' + Date.now(),
      name,
      is_default: false
    };

    setProfiles(prev => [...prev, newProfile]);

    if (isSupabaseConnected && supabase) {
      try {
        await supabase.from('expenses_profiles').insert([newProfile]);
      } catch (err) {
        console.warn('Supabase profile add fail:', err);
      }
    }
  };

  const selectProfile = async (id: string) => {
    const pf = profiles.find(p => p.id === id);
    if (pf) {
      // Set profile default
      setProfiles(prev => prev.map(p => ({
        ...p,
        is_default: p.id === id
      })));
      setActiveProfile(pf);

      // Auto toggle matching currency sample
      if (pf.name.toLowerCase() === 'rana') {
        setSettings(prev => ({ ...prev, currency: 'BDT' }));
      } else {
        setSettings(prev => ({ ...prev, currency: 'USD' }));
      }
    }
  };

  const updateChallenge = async (newChallenge: Partial<Challenge>) => {
    setChallenge(prev => {
      const updated = { ...prev, ...newChallenge };
      if (isSupabaseConnected && supabase) {
        supabase.from('expenses_challenge').update(updated).eq('id', updated.id).then();
      }
      return updated;
    });
  };

  const updateRecurringItem = async (id: string, updates: Partial<RecurringItem>) => {
    setRecurringItems(prev => prev.map(item => {
      if (item.id === id) {
        const uItem = { ...item, ...updates };
        if (isSupabaseConnected && supabase) {
          supabase.from('expenses_recurring').update(uItem).eq('id', id).then();
        }
        return uItem;
      }
      return item;
    }));
  };

  const updateSupabaseCredentials = (url: string, key: string) => {
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', key);
    setSupabaseUrl(url);
    setSupabaseAnonKey(key);
    
    if (url && key) {
      setIsSupabaseConnected(true);
      // Reload page or re-trigger sync
      window.location.reload();
    } else {
      setIsSupabaseConnected(false);
    }
  };

  const resetAll = () => {
    localStorage.removeItem('expenses_profiles');
    localStorage.removeItem('expenses_active_profile');
    localStorage.removeItem('expenses_accounts');
    localStorage.removeItem('expenses_transactions');
    localStorage.removeItem('expenses_recurring');
    localStorage.removeItem('expenses_challenge');
    localStorage.removeItem('expenses_settings');
    
    setProfiles(INITIAL_PROFILES);
    setActiveProfile(INITIAL_PROFILES[0]);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions([]);
    setRecurringItems(INITIAL_RECURRING_ITEMS);
    setChallenge(INITIAL_CHALLENGE);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <DataContext.Provider value={{
      profiles,
      activeProfile,
      accounts,
      transactions,
      recurringItems,
      challenge,
      settings,
      isSupabaseConnected,
      supabaseUrl,
      supabaseAnonKey,
      addTransaction,
      deleteTransaction,
      addAccount,
      updateAccountBalance,
      updateSettings,
      addProfile,
      selectProfile,
      updateChallenge,
      updateRecurringItem,
      updateSupabaseCredentials,
      resetAll,
      getCurrencySymbol
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

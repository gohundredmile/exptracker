import React, { useState } from 'react';
import { DataProvider } from './lib/dataContext';
import { HomeView } from './components/HomeView';
import { TransactionsView } from './components/TransactionsView';
import { AddTransactionView } from './components/AddTransactionView';
import { StatisticsView } from './components/StatisticsView';
import { SettingsView } from './components/SettingsView';
import { Navbar } from './components/Navbar';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const handleSetTab = (tab: string) => {
    setPreviousTab(currentTab);
    setTab(tab);
  };

  const handleOpenAddTx = () => {
    setShowAddTransaction(true);
  };

  const handleCloseAddTx = () => {
    setShowAddTransaction(false);
  };

  // Render correct active tab layout view
  const renderActiveView = () => {
    if (showAddTransaction) {
      return (
        <AnimatePresence mode="wait">
          <motion.div 
            key="add_tx"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <AddTransactionView onClose={handleCloseAddTx} />
          </motion.div>
        </AnimatePresence>
      );
    }

    switch (currentTab) {
      case 'transactions':
        return <TransactionsView />;
      case 'statistics':
        return <StatisticsView />;
      case 'settings':
        return <SettingsView />;
      case 'home':
      default:
        return <HomeView onAddTransactionClick={handleOpenAddTx} setTab={handleSetTab} />;
    }
  };

  return (
    <DataProvider>
      {/* Mobile simulator wrapper for desktop browsers, expanding completely natively on viewport */}
      <div className="min-h-screen bg-[#F1F5F9] md:py-6 flex items-center justify-center font-sans selection:bg-indigo-150 selection:text-indigo-900">
        <div className="w-full max-w-md bg-[#F8FAFC] min-h-screen md:min-h-[840px] md:rounded-[40px] md:shadow-[0_24px_50px_-12px_rgba(15,23,42,0.15)] flex flex-col relative overflow-hidden md:border-8 md:border-white">
          
          {/* Top Notch Simulator design accent */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-white rounded-b-2xl z-55 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-200 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={showAddTransaction ? 'add_tx_view' : currentTab}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.18 }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Persistent Floating bottom bar navigation if transaction form is idle */}
          {!showAddTransaction && (
            <Navbar 
              currentTab={currentTab} 
              setTab={handleSetTab} 
              onAddClick={handleOpenAddTx} 
            />
          )}

        </div>
      </div>
    </DataProvider>
  );
}

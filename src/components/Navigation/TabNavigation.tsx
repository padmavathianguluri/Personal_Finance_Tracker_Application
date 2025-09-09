import React from 'react';
import { BarChart3, List, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TabNavigationProps {
  activeTab: 'dashboard' | 'transactions';
  onTabChange: (tab: 'dashboard' | 'transactions') => void;
  onAddTransaction: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  onAddTransaction,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex bg-white/10 rounded-xl p-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange('dashboard')}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium',
              activeTab === 'dashboard'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-blue-200 hover:text-white'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange('transactions')}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium',
              activeTab === 'transactions'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-blue-200 hover:text-white'
            )}
          >
            <List className="w-4 h-4" />
            <span>Transactions</span>
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTransaction}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:block">Add Transaction</span>
        </motion.button>
      </div>
    </div>
  );
};
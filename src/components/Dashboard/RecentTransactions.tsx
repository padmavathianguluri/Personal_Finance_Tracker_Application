import React from 'react';
import { Transaction } from '../../types';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import { Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-blue-200">No transactions yet. Add your first transaction to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction, index) => {
          const category = DEFAULT_CATEGORIES.find(c => c.name === transaction.category);
          
          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: category?.color + '20' }}
                >
                  {category?.icon || '💰'}
                </div>
                <div>
                  <h4 className="font-medium text-white">{transaction.description}</h4>
                  <div className="flex items-center space-x-2 text-sm text-blue-200">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={clsx(
                  'font-semibold text-lg',
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
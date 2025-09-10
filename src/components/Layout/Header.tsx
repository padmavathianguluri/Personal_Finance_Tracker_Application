import React from 'react';
import { TrendingUp, Download, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FinanceTracker</h1>
              <p className="text-xs text-blue-200">Personal Finance Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-blue-200">
              <User className="w-4 h-4" />
              <span className="text-sm">Welcome, {user?.name}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:block">Export CSV</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
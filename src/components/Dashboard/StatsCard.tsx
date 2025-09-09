import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  change?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  amount, 
  icon: Icon, 
  color,
  change 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            change >= 0 ? 'text-green-300 bg-green-500/20' : 'text-red-300 bg-red-500/20'
          }`}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div>
        <p className="text-sm text-blue-200 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{formatCurrency(amount)}</p>
      </div>
    </motion.div>
  );
};
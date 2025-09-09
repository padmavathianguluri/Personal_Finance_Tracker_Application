import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Transaction } from '../../types';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartSectionProps {
  transactions: Transaction[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ transactions }) => {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: Object.keys(expensesByCategory).map(category => {
          const cat = DEFAULT_CATEGORIES.find(c => c.name === category);
          return cat?.color || '#6B7280';
        }),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [
          Object.values(incomeByCategory).reduce((sum, val) => sum + val, 0),
          Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0),
        ],
        backgroundColor: ['#10B981', '#EF4444'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    cutout: '60%',
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
        <div className="text-center py-12">
          <p className="text-blue-200">No transactions yet. Add some transactions to see your financial overview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Income vs Expenses</h3>
        <div className="h-64">
          <Bar data={incomeVsExpensesData} options={chartOptions} />
        </div>
      </motion.div>

      {Object.keys(expensesByCategory).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Expense Breakdown</h3>
          <div className="h-64">
            <Doughnut data={expenseChartData} options={doughnutOptions} />
          </div>
        </motion.div>
      )}
    </div>
  );
};
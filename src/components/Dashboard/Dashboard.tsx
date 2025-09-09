import React from 'react';
import { Transaction } from '../../types';
import { StatsCard } from './StatsCard';
import { ChartSection } from './ChartSection';
import { RecentTransactions } from './RecentTransactions';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { 
  calculateTotalByType, 
  getCurrentMonthTransactions, 
  formatCurrency 
} from '../../utils/helpers';

interface DashboardProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  onEditTransaction, 
  onDeleteTransaction 
}) => {
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const totalIncome = calculateTotalByType(currentMonthTransactions, 'income');
  const totalExpenses = calculateTotalByType(currentMonthTransactions, 'expense');
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          color="from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          color="from-red-500 to-rose-600"
        />
        <StatsCard
          title="Net Income"
          amount={netIncome}
          icon={Wallet}
          color={netIncome >= 0 ? "from-blue-500 to-indigo-600" : "from-orange-500 to-red-600"}
        />
        <StatsCard
          title="Savings Rate"
          amount={savingsRate}
          icon={Target}
          color="from-purple-500 to-violet-600"
        />
      </div>

      {/* Charts Section */}
      <ChartSection transactions={currentMonthTransactions} />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={transactions.slice(0, 10)}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
      />
    </div>
  );
};
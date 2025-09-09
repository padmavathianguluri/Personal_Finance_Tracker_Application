import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { useLocalStorage } from './useLocalStorage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('finance-transactions', []);
  const [loading, setLoading] = useState(false);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = async (id: string, transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...transactionData } : t)
    );
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const refetch = () => {
    // No-op for local storage version
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch,
  };
};
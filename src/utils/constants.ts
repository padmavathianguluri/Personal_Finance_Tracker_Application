import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: '1', name: 'Salary', type: 'income', color: '#10B981', icon: '💰' },
  { id: '2', name: 'Freelance', type: 'income', color: '#059669', icon: '💻' },
  { id: '3', name: 'Investment', type: 'income', color: '#047857', icon: '📈' },
  { id: '4', name: 'Other Income', type: 'income', color: '#065F46', icon: '💵' },
  
  // Expense categories
  { id: '5', name: 'Food & Dining', type: 'expense', color: '#EF4444', icon: '🍔' },
  { id: '6', name: 'Transportation', type: 'expense', color: '#F97316', icon: '🚗' },
  { id: '7', name: 'Shopping', type: 'expense', color: '#8B5CF6', icon: '🛍️' },
  { id: '8', name: 'Entertainment', type: 'expense', color: '#EC4899', icon: '🎬' },
  { id: '9', name: 'Bills & Utilities', type: 'expense', color: '#F59E0B', icon: '⚡' },
  { id: '10', name: 'Healthcare', type: 'expense', color: '#06B6D4', icon: '🏥' },
  { id: '11', name: 'Education', type: 'expense', color: '#3B82F6', icon: '📚' },
  { id: '12', name: 'Other Expense', type: 'expense', color: '#6B7280', icon: '💸' },
];

export const CURRENCY_SYMBOL = '$';
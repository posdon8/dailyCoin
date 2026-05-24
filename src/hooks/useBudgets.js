                                                                                                                                                                import { useState, useEffect } from 'react';
import {
  fetchBudgets,
  saveBudgetAPI,
  deleteBudgetAPI,
  fetchBudgetSummary,
} from '../services/api';

/**
 * Custom hook để quản lý ngân sách
 */
export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load budgets cho tháng/năm
   */
  const loadBudgets = async (month, year) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBudgets(month, year);
      console.log('budgets loaded:', data);
      setBudgets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load tổng quan budget
   */
  const loadBudgetSummary = async (month, year) => {
    try {
      const data = await fetchBudgetSummary(month, year);
      setSummary(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading budget summary:', err);
    }
  };

  /**
   * Lưu/cập nhật budget
   */
  const saveBudget = async (category, limit, month, year, notes = '') => {
    try {
      const budget = await saveBudgetAPI(category, limit, month, year, notes);
      
      // Cập nhật state
      const index = budgets.findIndex(
        (b) => b.category === category && b.month === month && b.year === year
      );
      
      if (index >= 0) {
        const updated = [...budgets];
        updated[index] = budget;
        setBudgets(updated);
      } else {
        setBudgets([budget, ...budgets]);
      }
      
      return budget;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Xóa budget
   */
  const deleteBudget = async (budgetId) => {
    try {
      await deleteBudgetAPI(budgetId);
      setBudgets(budgets.filter((b) => b._id !== budgetId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Lấy budget của một danh mục
   */
  const getBudgetByCategory = (category) => {
    return budgets.find((b) => b.category === category);
  };

  /**
   * Kiểm tra cảnh báo ngân sách
   */
  const getWarnings = () => {
    if (!summary) return [];
    return summary.alerts || [];
  };

  return {
    budgets,
    summary,
    loading,
    error,
    loadBudgets,
    loadBudgetSummary,
    saveBudget,
    deleteBudget,
    getBudgetByCategory,
    getWarnings,
  };
};

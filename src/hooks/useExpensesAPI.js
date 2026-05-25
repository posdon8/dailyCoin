import { useEffect, useState } from 'react';
import {
  fetchExpenses,
  fetchExpenseById,
  createExpenseAPI,
  updateExpenseAPI,
  deleteExpenseAPI,
  fetchExpensesByDateRange,
  fetchExpensesByMonth,
  fetchExpenseStats,
} from '../services/api';

/**
 * Custom hook để quản lý chi tiêu - API Version
 */
export const useExpenses = (enabled = true) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dữ liệu từ API khi component mount hoặc khi auth ready
  useEffect(() => {
    if (enabled) {
      loadExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [enabled]);

  /**
   * Load tất cả chi tiêu
   */
  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Thêm chi tiêu mới
   */
  const addExpense = async (expense) => {
    try {
      const newExpense = await createExpenseAPI(expense);
      setExpenses([newExpense, ...expenses]);
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Cập nhật chi tiêu
   */
  const updateExpense = async (id, updatedData) => {
    try {
      const updated = await updateExpenseAPI(id, updatedData);
      setExpenses(
        expenses.map((exp) => (exp.id === id ? updated : exp))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Xóa chi tiêu
   */
  const deleteExpense = async (id) => {
    try {
      await deleteExpenseAPI(id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Lấy chi tiêu theo ID
   */
  const getExpenseById = (id) => {
    return expenses.find((exp) => exp.id === id);
  };

  /**
   * Lọc chi tiêu theo danh mục
   */
  const filterByCategory = (category) => {
    if (!category) return expenses;
    return expenses.filter((exp) => exp.category === category);
  };

  /**
   * Lọc chi tiêu theo khoảng ngày
   */
  const filterByDateRange = async (startDate, endDate) => {
    try {
      return await fetchExpensesByDateRange(startDate, endDate);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Lọc chi tiêu theo tháng năm
   */
  const filterByMonth = async (month, year) => {
    try {
      return await fetchExpensesByMonth(month, year);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Tính tổng chi tiêu
   */
  const getTotalAmount = (filteredExpenses = expenses) => {
    return filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  /**
   * Tính chi tiêu theo danh mục
   */
  const getAmountByCategory = (filteredExpenses = expenses) => {
    return filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});
  };

  /**
   * Tính chi tiêu theo ngày
   */
  const getAmountByDate = (filteredExpenses = expenses) => {
    return filteredExpenses.reduce((acc, exp) => {
      acc[exp.date] = (acc[exp.date] || 0) + exp.amount;
      return acc;
    }, {});
  };

  /**
   * Lấy chi tiêu hôm nay
   */
  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return filterByDateRange(today, today);
  };

  /**
   * Lấy thống kê hôm nay
   */
  const getTodayStats = () => {
    const todayExpenses = expenses.filter(
      (exp) => exp.date === new Date().toISOString().split('T')[0]
    );
    return {
      count: todayExpenses.length,
      total: getTotalAmount(todayExpenses),
      byCategory: getAmountByCategory(todayExpenses),
    };
  };

  /**
   * Tìm kiếm chi tiêu
   */
  const searchExpenses = (query) => {
    const lowerQuery = query.toLowerCase();
    return expenses.filter((exp) =>
      exp.description.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * Sắp xếp chi tiêu
   */
  const sortExpenses = (sortBy = 'date', order = 'desc') => {
    const sorted = [...expenses];
    if (sortBy === 'date') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'amount') {
      sorted.sort((a, b) => {
        return order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      });
    }
    return sorted;
  };

  /**
   * Lấy thống kê
   */
  const getStats = async (month, year) => {
    try {
      return await fetchExpenseStats(month, year);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Làm mới dữ liệu
   */
  const refresh = () => {
    loadExpenses();
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    filterByCategory,
    filterByDateRange,
    filterByMonth,
    getTotalAmount,
    getAmountByCategory,
    getAmountByDate,
    getTodayExpenses,
    getTodayStats,
    searchExpenses,
    sortExpenses,
    getStats,
    refresh,
  };
};

import { useEffect, useState } from 'react';
import { getExpenses, saveExpenses } from '../utils/storage';

/**
 * Custom hook để quản lý chi tiêu
 * Cung cấp CRUD operations và các hàm tiện ích
 */
export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const loadedExpenses = getExpenses();
    setExpenses(loadedExpenses);
    setLoading(false);
  }, []);

  // Save vào localStorage khi expenses thay đổi
  useEffect(() => {
    if (!loading) {
      saveExpenses(expenses);
    }
  }, [expenses, loading]);

  /**
   * Thêm chi tiêu mới
   */
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };

  /**
   * Cập nhật chi tiêu
   */
  const updateExpense = (id, updatedData) => {
    setExpenses(
      expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedData } : exp
      )
    );
  };

  /**
   * Xóa chi tiêu
   */
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
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
  const filterByDateRange = (startDate, endDate) => {
    return expenses.filter(
      (exp) => exp.date >= startDate && exp.date <= endDate
    );
  };

  /**
   * Lọc chi tiêu theo tháng năm
   */
  const filterByMonth = (month, year) => {
    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return (
        expDate.getMonth() + 1 === month && expDate.getFullYear() === year
      );
    });
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
    const todayExpenses = getTodayExpenses();
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

  return {
    expenses,
    loading,
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
  };
};

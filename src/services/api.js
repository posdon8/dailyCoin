/**
 * API Service - Quản lý tất cả gọi API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_ID = 'default-user'; // Tạm thời, sau sẽ lấy từ auth

/**
 * Hàm fetch chung với error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Lấy tất cả chi tiêu
 */
export const fetchExpenses = async () => {
  const response = await apiCall(`/expenses?userId=${USER_ID}`);
  // Format lại từ MongoDB response thành format frontend
  return response.data.map((expense) => ({
    id: expense._id,
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.dateString || new Date(expense.date).toISOString().split('T')[0],
    tags: expense.tags || [],
    notes: expense.notes || '',
  }));
};

/**
 * Lấy chi tiêu theo ID
 */
export const fetchExpenseById = async (id) => {
  const response = await apiCall(`/expenses/${id}`);
  const expense = response.data;
  return {
    id: expense._id,
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.dateString || new Date(expense.date).toISOString().split('T')[0],
    tags: expense.tags || [],
    notes: expense.notes || '',
  };
};

/**
 * Tạo chi tiêu mới
 */
export const createExpenseAPI = async (expense) => {
  const response = await apiCall('/expenses', {
    method: 'POST',
    body: JSON.stringify({
      userId: USER_ID,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      tags: expense.tags || [],
      notes: expense.notes || '',
    }),
  });

  return {
    id: response.data._id,
    amount: response.data.amount,
    category: response.data.category,
    description: response.data.description,
    date: response.data.dateString || new Date(response.data.date).toISOString().split('T')[0],
    tags: response.data.tags || [],
    notes: response.data.notes || '',
  };
};

/**
 * Cập nhật chi tiêu
 */
export const updateExpenseAPI = async (id, expense) => {
  const response = await apiCall(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      tags: expense.tags || [],
      notes: expense.notes || '',
    }),
  });

  return {
    id: response.data._id,
    amount: response.data.amount,
    category: response.data.category,
    description: response.data.description,
    date: response.data.dateString || new Date(response.data.date).toISOString().split('T')[0],
    tags: response.data.tags || [],
    notes: response.data.notes || '',
  };
};

/**
 * Xóa chi tiêu
 */
export const deleteExpenseAPI = async (id) => {
  await apiCall(`/expenses/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Lấy chi tiêu theo khoảng ngày
 */
export const fetchExpensesByDateRange = async (startDate, endDate) => {
  const response = await apiCall(
    `/expenses/range/search?userId=${USER_ID}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data.map((expense) => ({
    id: expense._id,
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.dateString || new Date(expense.date).toISOString().split('T')[0],
    tags: expense.tags || [],
    notes: expense.notes || '',
  }));
};

/**
 * Lấy chi tiêu theo tháng
 */
export const fetchExpensesByMonth = async (month, year) => {
  const response = await apiCall(
    `/expenses/month/search?userId=${USER_ID}&month=${month}&year=${year}`
  );
  return response.data.map((expense) => ({
    id: expense._id,
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.dateString || new Date(expense.date).toISOString().split('T')[0],
    tags: expense.tags || [],
    notes: expense.notes || '',
  }));
};

/**
 * Lấy thống kê chi tiêu
 */
export const fetchExpenseStats = async (month, year) => {
  const response = await apiCall(
    `/expenses/stats/analytics?userId=${USER_ID}&month=${month}&year=${year}`
  );
  return response.data;
};

/**
 * Export dữ liệu
 */
export const exportData = async () => {
  const expenses = await fetchExpenses();
  return {
    expenses,
    settings: {
      currency: 'VND',
      language: 'vi',
    },
  };
};

/**
 * Import dữ liệu (tạo nhiều expense cùng lúc)
 */
export const importData = async (data) => {
  if (!data.expenses || !Array.isArray(data.expenses)) {
    throw new Error('Invalid import data format');
  }

  const results = [];
  for (const expense of data.expenses) {
    try {
      const result = await createExpenseAPI(expense);
      results.push(result);
    } catch (error) {
      console.error('Error importing expense:', error);
    }
  }

  return results;
};

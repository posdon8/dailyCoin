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

// ================================
// BUDGET APIs
// ================================

/**
 * Lấy tất cả budget của tháng
 */
export const fetchBudgets = async (month, year) => {
  const response = await apiCall(`/budgets?month=${month}&year=${year}`);
  return response;
};

/**
 * Tạo hoặc cập nhật budget
 */
export const saveBudgetAPI = async (category, limit, month, year, notes) => {
  const response = await apiCall('/budgets', {
    method: 'POST',
    body: JSON.stringify({
      category,
      limit,
      month,
      year,
      notes: notes || '',
    }),
  });
  return response.data;
};

/**
 * Xóa budget
 */
export const deleteBudgetAPI = async (budgetId) => {
  await apiCall(`/budgets/${budgetId}`, {
    method: 'DELETE',
  });
};

/**
 * Lấy tổng quan budget + cảnh báo
 */
export const fetchBudgetSummary = async (month, year) => {
  const response = await apiCall(`/budgets/summary?month=${month}&year=${year}`);
  return response;
};

// ================================
// WALLET APIs
// ================================

/**
 * Lấy tất cả ví
 */
export const fetchWallets = async () => {
  const response = await apiCall('/wallets');
  return response.data || [];
};

/**
 * Tạo ví mới
 */
export const createWalletAPI = async (wallet) => {
  const response = await apiCall('/wallets', {
    method: 'POST',
    body: JSON.stringify(wallet),
  });
  return response.data;
};

/**
 * Cập nhật ví
 */
export const updateWalletAPI = async (walletId, updates) => {
  const response = await apiCall(`/wallets/${walletId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return response.data;
};

/**
 * Xóa ví
 */
export const deleteWalletAPI = async (walletId) => {
  await apiCall(`/wallets/${walletId}`, {
    method: 'DELETE',
  });
};

/**
 * Lấy tổng hợp tất cả ví
 */
export const fetchWalletsSummary = async () => {
  const response = await apiCall('/wallets/summary/total');
  return response.data;
};

/**
 * Cập nhật số dư ví
 */
export const updateWalletBalance = async (walletId, balance, operation, amount) => {
  const response = await apiCall(`/wallets/${walletId}/balance`, {
    method: 'PUT',
    body: JSON.stringify({
      balance,
      operation,
      amount,
    }),
  });
  return response.data;
};

// ================================
// ATTACHMENT APIs
// ================================

/**
 * Tải ảnh lên
 */
export const uploadAttachmentAPI = async (expenseId, file, description = '') => {
  // Chuyển file sang base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const response = await apiCall('/attachments', {
          method: 'POST',
          body: JSON.stringify({
            expenseId,
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size,
            fileData: reader.result, // Base64
            description,
          }),
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Lấy attachment của chi tiêu
 */
export const fetchAttachmentsByExpense = async (expenseId) => {
  const response = await apiCall(`/attachments/expense/${expenseId}`);
  return response.data || [];
};

/**
 * Lấy chi tiết attachment
 */
export const fetchAttachmentById = async (attachmentId) => {
  const response = await apiCall(`/attachments/${attachmentId}`);
  return response.data;
};

/**
 * Xóa attachment
 */
export const deleteAttachmentAPI = async (attachmentId) => {
  await apiCall(`/attachments/${attachmentId}`, {
    method: 'DELETE',
  });
};

/**
 * Cập nhật attachment
 */
export const updateAttachmentAPI = async (attachmentId, description) => {
  const response = await apiCall(`/attachments/${attachmentId}/update`, {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
  return response.data;
};

/**
 * Lấy tất cả attachment
 */
export const fetchAttachments = async () => {
  const response = await apiCall('/attachments');
  return response.data || [];
};

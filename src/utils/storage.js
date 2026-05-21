const STORAGE_KEY = 'dailyExpenses_data';
const DEFAULT_DATA = {
  expenses: [],
  settings: {
    currency: 'VND',
    language: 'vi',
  },
};

/**
 * Lấy dữ liệu từ localStorage
 * @returns {object}
 */
export const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DATA;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return DEFAULT_DATA;
  }
};

/**
 * Lưu dữ liệu vào localStorage
 * @param {object} data - Dữ liệu cần lưu
 */
export const saveStorageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

/**
 * Lấy danh sách chi tiêu
 * @returns {array}
 */
export const getExpenses = () => {
  const data = getStorageData();
  return data.expenses || [];
};

/**
 * Lưu danh sách chi tiêu
 * @param {array} expenses - Danh sách chi tiêu
 */
export const saveExpenses = (expenses) => {
  const data = getStorageData();
  data.expenses = expenses;
  saveStorageData(data);
};

/**
 * Xóa tất cả dữ liệu
 */
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Export dữ liệu thành JSON
 * @returns {string}
 */
export const exportData = () => {
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
};

/**
 * Import dữ liệu từ JSON
 * @param {string} jsonString - JSON string
 * @returns {boolean}
 */
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (data.expenses && Array.isArray(data.expenses)) {
      saveStorageData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

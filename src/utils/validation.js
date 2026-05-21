/**
 * Validate dữ liệu chi tiêu
 * @param {object} expense - Chi tiêu cần validate
 * @returns {object} - { isValid: boolean, errors: [] }
 */
export const validateExpense = (expense) => {
  const errors = [];

  if (!expense.amount || expense.amount <= 0) {
    errors.push('Số tiền phải lớn hơn 0');
  }

  if (!expense.category) {
    errors.push('Vui lòng chọn danh mục');
  }

  if (!expense.description || expense.description.trim() === '') {
    errors.push('Vui lòng nhập mô tả');
  } else if (expense.description.length > 200) {
    errors.push('Mô tả không được vượt quá 200 ký tự');
  }

  if (!expense.date) {
    errors.push('Vui lòng chọn ngày');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate số tiền
 * @param {number} amount - Số tiền
 * @returns {boolean}
 */
export const isValidAmount = (amount) => {
  return amount && !isNaN(amount) && Number(amount) > 0;
};

/**
 * Validate ngày
 * @param {string} date - Ngày (format: YYYY-MM-DD)
 * @returns {boolean}
 */
export const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  return !isNaN(new Date(date).getTime());
};

/**
 * Trim object string values
 * @param {object} obj - Object cần trim
 * @returns {object}
 */
export const trimStringValues = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key];
    return acc;
  }, {});
};

// Danh mục chi tiêu
export const EXPENSE_CATEGORIES = {
  food: {
    id: 'food',
    label: '🍔 Ăn uống',
    color: '#FF6B6B',
    icon: '🍽️',
  },
  transport: {
    id: 'transport',
    label: '🚗 Đi lại',
    color: '#4ECDC4',
    icon: '🚕',
  },
  shopping: {
    id: 'shopping',
    label: '🛍️ Mua sắm',
    color: '#FFE66D',
    icon: '🛒',
  },
  entertainment: {
    id: 'entertainment',
    label: '🎬 Giải trí',
    color: '#95E1D3',
    icon: '🎭',
  },
  other: {
    id: 'other',
    label: '📌 Khác',
    color: '#C7CEEA',
    icon: '💫',
  },
};

// Danh sách danh mục
export const CATEGORIES_LIST = Object.values(EXPENSE_CATEGORIES);

// Màu sắc
export const COLORS = {
  primary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  light: '#ecf0f1',
  dark: '#2c3e50',
  text: '#34495e',
};

// Thông báo
export const MESSAGES = {
  addSuccess: '✓ Thêm chi tiêu thành công',
  editSuccess: '✓ Cập nhật chi tiêu thành công',
  deleteSuccess: '✓ Xóa chi tiêu thành công',
  deleteConfirm: 'Bạn có chắc muốn xóa chi tiêu này?',
  validationError: '❌ Vui lòng kiểm tra lại dữ liệu',
  emptyList: 'Không có chi tiêu nào',
};

// Định dạng tiền tệ
export const CURRENCY = {
  code: 'VND',
  symbol: '₫',
  decimals: 0,
};

// Tháng
export const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export const MONTH_SHORT = [
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
];

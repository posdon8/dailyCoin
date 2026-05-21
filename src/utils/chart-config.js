import { EXPENSE_CATEGORIES } from './constants';

/**
 * Lấy cấu hình màu sắc cho biểu đồ danh mục
 * @param {array} categories - Danh sách danh mục
 * @returns {array} - Mảng màu
 */
export const getCategoryColors = (categories = Object.keys(EXPENSE_CATEGORIES)) => {
  return categories.map((cat) => EXPENSE_CATEGORIES[cat]?.color || '#999');
};

/**
 * Cấu hình chung cho Recharts
 */
export const chartConfig = {
  responsive: true,
  margin: { top: 20, right: 30, left: 0, bottom: 20 },
  colors: Object.values(EXPENSE_CATEGORIES).map((cat) => cat.color),
};

/**
 * Cấu hình PieChart
 */
export const pieChartConfig = {
  width: '100%',
  height: 300,
  ...chartConfig,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
};

/**
 * Cấu hình BarChart
 */
export const barChartConfig = {
  width: '100%',
  height: 300,
  ...chartConfig,
};

/**
 * Cấu hình LineChart
 */
export const lineChartConfig = {
  width: '100%',
  height: 300,
  ...chartConfig,
};

/**
 * Custom tooltip style
 */
export const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

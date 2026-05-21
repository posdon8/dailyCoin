import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { CURRENCY } from './constants';

dayjs.locale('vi');

/**
 * Format số tiền thành chuỗi tiền tệ VND
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi tiền tệ
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ' + CURRENCY.symbol;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ngày thành chuỗi định dạng
 * @param {string} date - Ngày (ISO format)
 * @param {string} format - Định dạng
 * @returns {string} - Ngày đã format
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return dayjs(date).format(format);
};

/**
 * Format ngày thành tiếng Việt (VD: 21 tháng 5, 2026)
 * @param {string} date - Ngày
 * @returns {string}
 */
export const formatDateVN = (date) => {
  return dayjs(date).format('DD [tháng] MM, YYYY');
};

/**
 * Format ngày thành định dạng ngắn (VD: 21/05)
 * @param {string} date - Ngày
 * @returns {string}
 */
export const formatDateShort = (date) => {
  return dayjs(date).format('DD/MM');
};

/**
 * Lấy tháng năm từ ngày (VD: 5-2026)
 * @param {string} date - Ngày
 * @returns {string}
 */
export const getMonthYear = (date) => {
  return dayjs(date).format('M-YYYY');
};

/**
 * Lấy text tháng năm (VD: Tháng 5, 2026)
 * @param {string} date - Ngày
 * @returns {string}
 */
export const getMonthYearText = (date) => {
  return dayjs(date).format('MMMM, YYYY');
};

/**
 * Kiểm tra hai ngày có cùng tháng không
 * @param {string} date1 - Ngày 1
 * @param {string} date2 - Ngày 2
 * @returns {boolean}
 */
export const isSameMonth = (date1, date2) => {
  return dayjs(date1).isSame(dayjs(date2), 'month');
};

/**
 * Lấy ngày đầu tháng
 * @param {string} date - Ngày
 * @returns {string} - Ngày đầu tháng
 */
export const getFirstDayOfMonth = (date) => {
  return dayjs(date).startOf('month').format('YYYY-MM-DD');
};

/**
 * Lấy ngày cuối tháng
 * @param {string} date - Ngày
 * @returns {string} - Ngày cuối tháng
 */
export const getLastDayOfMonth = (date) => {
  return dayjs(date).endOf('month').format('YYYY-MM-DD');
};

/**
 * So sánh hai ngày
 * @param {string} date1
 * @param {string} date2
 * @returns {number} - âm nếu date1 < date2, dương nếu date1 > date2, 0 nếu bằng
 */
export const compareDates = (date1, date2) => {
  return dayjs(date1).diff(dayjs(date2), 'day');
};

/**
 * Lấy ngày hôm nay
 * @returns {string} - Ngày hôm nay (YYYY-MM-DD)
 */
export const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

/**
 * Truncate text
 * @param {string} text - Text
 * @param {number} length - Độ dài
 * @returns {string}
 */
export const truncateText = (text, length = 50) => {
  if (text && text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

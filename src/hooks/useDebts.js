import { useState, useCallback } from 'react';
import * as api from '../services/api';

/**
 * Hook để quản lý nợ
 */
export const useDebts = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Lấy tất cả nợ
  const fetchDebts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/debts?${params.toString()}`);
      if (response.success) {
        setDebts(response.data);
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải nợ');
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy nợ theo ID
  const fetchDebtById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/debts/${id}`);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải nợ');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Tạo nợ mới
  const createDebt = useCallback(async (debtData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/debts', debtData);
      if (response.success) {
        setDebts([...debts, response.data]);
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo nợ');
      return null;
    } finally {
      setLoading(false);
    }
  }, [debts]);

  // Cập nhật nợ
  const updateDebt = useCallback(async (id, debtData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/debts/${id}`, debtData);
      if (response.success) {
        setDebts(
          debts.map((debt) => (debt._id === id ? response.data : debt))
        );
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật nợ');
      return null;
    } finally {
      setLoading(false);
    }
  }, [debts]);

  // Xóa nợ
  const deleteDebt = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.deleteAPI(`/debts/${id}`);
        if (response.success) {
          setDebts(debts.filter((debt) => debt._id !== id));
          return true;
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi xóa nợ');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [debts]
  );

  // Ghi nhận thanh toán
  const recordPayment = useCallback(
    async (id, amount, sendNotification = false) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post(`/debts/${id}/payment`, {
          amountPaid: amount,
          sendNotification,
        });
        if (response.success) {
          setDebts(
            debts.map((debt) => (debt._id === id ? response.data : debt))
          );
          return response.data;
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi ghi nhận thanh toán');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [debts]
  );

  // Tìm kiếm nợ
  const searchDebts = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query });
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/debts/search/query?${params.toString()}`);
      if (response.success) {
        setDebts(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tìm kiếm nợ');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy thống kê nợ
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/debts/stats/analytics');
      if (response.success) {
        setStats(response);
        return response;
      }
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thống kê nợ');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    debts,
    setDebts,
    loading,
    error,
    stats,
    fetchDebts,
    fetchDebtById,
    createDebt,
    updateDebt,
    deleteDebt,
    recordPayment,
    searchDebts,
    fetchStats,
  };
};

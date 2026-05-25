import { useState, useEffect } from 'react';
import {
  fetchWallets,
  createWalletAPI,
  updateWalletAPI,
  deleteWalletAPI,
  fetchWalletsSummary,
  updateWalletBalance,
} from '../services/api';

/**
 * Custom hook để quản lý ví/tài khoản
 */
export const useWallets = (enabled = true) => {
  const [wallets, setWallets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load tất cả ví
   */
  const loadWallets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWallets();
      setWallets(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading wallets:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load tổng hợp ví
   */
  const loadWalletsSummary = async () => {
    try {
      const data = await fetchWalletsSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading wallets summary:', err);
    }
  };

  /**
   * Tạo ví mới
   */
  const createWallet = async (wallet) => {
    try {
      const newWallet = await createWalletAPI(wallet);
      setWallets([newWallet, ...wallets]);
      return newWallet;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Cập nhật ví
   */
  const updateWallet = async (walletId, updates) => {
    try {
      const updated = await updateWalletAPI(walletId, updates);
      setWallets(wallets.map((w) => (w._id === walletId ? updated : w)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Xóa ví
   */
  const deleteWallet = async (walletId) => {
    try {
      await deleteWalletAPI(walletId);
      setWallets(wallets.filter((w) => w._id !== walletId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Cập nhật số dư ví
   */
  const updateBalance = async (walletId, balance, operation = 'set', amount = 0) => {
    try {
      const updated = await updateWalletBalance(walletId, balance, operation, amount);
      setWallets(wallets.map((w) => (w._id === walletId ? updated : w)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Lấy ví theo ID
   */
  const getWalletById = (walletId) => {
    return wallets.find((w) => w._id === walletId);
  };

  /**
   * Lấy ví theo loại
   */
  const getWalletsByType = (type) => {
    return wallets.filter((w) => w.type === type && w.isActive);
  };

  /**
   * Lấy tổng số dư
   */
  const getTotalBalance = () => {
    return wallets.reduce((sum, w) => sum + (w.balance || 0), 0);
  };

  /**
   * Load khi component mount
   */
  useEffect(() => {
    if (enabled) {
      loadWallets();
      loadWalletsSummary();
    } else {
      setWallets([]);
      setSummary(null);
    }
  }, [enabled]);

  return {
    wallets,
    summary,
    loading,
    error,
    loadWallets,
    loadWalletsSummary,
    createWallet,
    updateWallet,
    deleteWallet,
    updateBalance,
    getWalletById,
    getWalletsByType,
    getTotalBalance,
  };
};

import { useState } from 'react';
import {
  uploadAttachmentAPI,
  fetchAttachmentsByExpense,
  deleteAttachmentAPI,
  updateAttachmentAPI,
} from '../services/api';

/**
 * Custom hook để quản lý đính kèm/ảnh
 */
export const useAttachments = () => {
  const [attachments, setAttachments] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load attachment của expense
   */
  const loadAttachments = async (expenseId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAttachmentsByExpense(expenseId);
      setAttachments((prev) => ({
        ...prev,
        [expenseId]: data,
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error loading attachments:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tải ảnh lên
   */
  const uploadAttachment = async (expenseId, file, description = '') => {
    try {
      setLoading(true);
      setError(null);
      const attachment = await uploadAttachmentAPI(expenseId, file, description);
      
      setAttachments((prev) => ({
        ...prev,
        [expenseId]: [...(prev[expenseId] || []), attachment],
      }));
      
      return attachment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa attachment
   */
  const deleteAttachment = async (expenseId, attachmentId) => {
    try {
      setLoading(true);
      await deleteAttachmentAPI(attachmentId);
      
      setAttachments((prev) => ({
        ...prev,
        [expenseId]: (prev[expenseId] || []).filter((a) => a._id !== attachmentId),
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cập nhật attachment
   */
  const updateAttachment = async (expenseId, attachmentId, description) => {
    try {
      const updated = await updateAttachmentAPI(attachmentId, description);
      
      setAttachments((prev) => ({
        ...prev,
        [expenseId]: (prev[expenseId] || []).map((a) =>
          a._id === attachmentId ? updated : a
        ),
      }));
      
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Lấy attachment của expense
   */
  const getAttachmentsByExpense = (expenseId) => {
    return attachments[expenseId] || [];
  };

  /**
   * Kiểm tra có attachment
   */
  const hasAttachments = (expenseId) => {
    return (attachments[expenseId] || []).length > 0;
  };

  return {
    attachments,
    loading,
    error,
    loadAttachments,
    uploadAttachment,
    deleteAttachment,
    updateAttachment,
    getAttachmentsByExpense,
    hasAttachments,
  };
};

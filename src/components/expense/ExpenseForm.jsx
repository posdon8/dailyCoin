import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, MESSAGES } from '../../utils/constants';
import { validateExpense, trimStringValues } from '../../utils/validation';
import { getTodayDate } from '../../utils/format';
import { useWallets } from '../../hooks/useWallets';
import { useAttachments } from '../../hooks/useAttachments';
import ImageUpload from '../attachment/ImageUpload';
import ImageGallery from '../attachment/ImageGallery';

const ExpenseForm = ({ onSubmit, initialData = null, isEditing = false, onNotification }) => {
  const { wallets } = useWallets();
  const { attachments, loading: attachmentLoading, uploadAttachment, deleteAttachment, loadAttachments } = useAttachments();

  const [formData, setFormData] = useState(
    initialData || {
      amount: '',
      category: 'food',
      description: '',
      date: getTodayDate(),
      walletId: '',
      notes: '',
      tags: [],
    }
  );
  const [errors, setErrors] = useState([]);
  const [currentAttachments, setCurrentAttachments] = useState([]);

  // Load attachments khi editing
  useEffect(() => {
    if (isEditing && initialData?.id) {
      loadAttachments(initialData.id);
      if (attachments[initialData.id]) {
        setCurrentAttachments(attachments[initialData.id]);
      }
    }
  }, [isEditing, initialData?.id]);

  // Update attachments khi thay đổi
  useEffect(() => {
    if (isEditing && initialData?.id && attachments[initialData.id]) {
      setCurrentAttachments(attachments[initialData.id]);
    }
  }, [attachments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleUploadImage = async (expenseId, file, description) => {
    try {
      await uploadAttachment(expenseId, file, description);
      setCurrentAttachments(attachments[expenseId] || []);
      onNotification?.('📸 Tải ảnh thành công', 'success');
    } catch (err) {
      onNotification?.(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await deleteAttachment(initialData.id, attachmentId);
      setCurrentAttachments(currentAttachments.filter(a => a._id !== attachmentId));
      onNotification?.('✅ Xóa ảnh thành công', 'success');
    } catch (err) {
      onNotification?.(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = trimStringValues(formData);
    const validation = validateExpense(trimmed);
    console.log('FORM DATA:', formData);
  console.log('TRIMMED:', trimmed);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSubmit(trimmed);
    setFormData({
      amount: '',
      category: 'food',
      description: '',
      date: getTodayDate(),
      walletId: '',
      notes: '',
      tags: [],
    });
  };

  return (
    <div className="card form-card">
      <h2 className="card-header">
        {isEditing ? '✏️ Cập nhật chi tiêu' : '➕ Thêm chi tiêu mới'}
      </h2>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.map((error, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">Số tiền (VND) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Danh mục *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {Object.values(EXPENSE_CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả chi tiêu..."
            maxLength="200"
            required
          />
          <small style={{ color: '#7f8c8d', marginTop: '4px', display: 'block' }}>
            {formData.description.length}/200
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="date">Ngày *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* NEW: Wallet Selection */}
        <div className="form-group">
          <label htmlFor="walletId">Ví / Tài khoản (tùy chọn)</label>
          <select
            id="walletId"
            name="walletId"
            value={formData.walletId}
            onChange={handleChange}
          >
            <option value="">-- Không chọn --</option>
            {wallets?.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.icon} {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* NEW: Notes */}
        <div className="form-group">
          <label htmlFor="notes">Ghi chú (tùy chọn)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Thêm ghi chú thêm..."
            maxLength="500"
            rows="2"
          />
          <small style={{ color: '#7f8c8d', marginTop: '4px', display: 'block' }}>
            {formData.notes.length}/500
          </small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? '💾 Cập nhật' : '➕ Thêm'}
          </button>
        </div>
      </form>

      {/* NEW: Images (only when editing) */}
      {isEditing && initialData?.id && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>📸 Ảnh hóa đơn</h3>
          <ImageUpload
            expenseId={initialData.id}
            onUpload={handleUploadImage}
            loading={attachmentLoading}
          />
          <ImageGallery
            attachments={currentAttachments}
            onDelete={handleDeleteAttachment}
            loading={attachmentLoading}
          />
        </div>
      )}

      <style>{`
        .form-card {
          margin-bottom: 20px;
        }

        .expense-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text);
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .form-actions button {
          flex: 1;
        }

        @media (max-width: 768px) {
          .form-group input,
          .form-group textarea,
          .form-group select {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseForm;

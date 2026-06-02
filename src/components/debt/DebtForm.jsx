import React, { useState, useEffect } from 'react';
import '../styles/DebtForm.css';

const DebtForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    debtorName: '',
    debtorEmail: '',
    bankName: '',
    bankAccount: '',
    amount: '',
    description: '',
    category: 'personal',
    dueDate: '',
    priority: 'medium',
    notes: '',
    sendNotification: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const dueDate = new Date(initialData.dueDate)
        .toISOString()
        .split('T')[0];
      setFormData({
        debtorName: initialData.debtorName,
        debtorEmail: initialData.debtorEmail || '',
        bankName: initialData.bankName || '',
        bankAccount: initialData.bankAccount || '',
        amount: initialData.amount,
        description: initialData.description,
        category: initialData.category || 'personal',
        dueDate,
        priority: initialData.priority || 'medium',
        notes: initialData.notes || '',
        sendNotification: false,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.debtorName.trim()) {
      newErrors.debtorName = 'Vui lòng nhập tên người nợ';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn ngày đến hạn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    }
  };

  return (
    <form className="debt-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Sửa khoản nợ' : 'Thêm khoản nợ mới'}</h2>

      <div className="form-group">
        <label htmlFor="debtorName">Tên người nợ *</label>
        <input
          id="debtorName"
          type="text"
          name="debtorName"
          value={formData.debtorName}
          onChange={handleChange}
          placeholder="Nhập tên người nợ"
          className={errors.debtorName ? 'error' : ''}
        />
        {errors.debtorName && (
          <span className="error-text">{errors.debtorName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="debtorEmail">Email người nợ</label>
        <input
          id="debtorEmail"
          type="email"
          name="debtorEmail"
          value={formData.debtorEmail}
          onChange={handleChange}
          placeholder="Nhập email (tuỳ chọn)"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bankName">🏦 Ngân hàng</label>
          <input
            id="bankName"
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            placeholder="VD: Vietcombank, Techcombank..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankAccount">🔢 Số tài khoản</label>
          <input
            id="bankAccount"
            type="text"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleChange}
            placeholder="Số tài khoản (tuỳ chọn)"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Số tiền nợ (VND) *</label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="1000"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && (
            <span className="error-text">{errors.amount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Ngày đến hạn *</label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={errors.dueDate ? 'error' : ''}
          />
          {errors.dueDate && (
            <span className="error-text">{errors.dueDate}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Mô tả *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mô tả chi tiết khoản nợ"
          rows="3"
          className={errors.description ? 'error' : ''}
        />
        {errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="personal">Cá nhân</option>
            <option value="business">Kinh doanh</option>
            <option value="loan">Vay mượn</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Mức độ ưu tiên</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Ghi chú</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Ghi chú thêm (tuỳ chọn)"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="sendNotification" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="sendNotification"
            type="checkbox"
            name="sendNotification"
            checked={formData.sendNotification}
            onChange={handleChange}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <span>📧 Gửi email thông báo cho người nợ</span>
        </label>
        {formData.sendNotification && !formData.debtorEmail && (
          <span className="error-text">⚠️ Email người nợ là bắt buộc để gửi thông báo</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Cập nhật' : 'Thêm nợ'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default DebtForm;

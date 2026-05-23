import { useState } from 'react';
import { CATEGORIES_LIST } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';

/**
 * Form tạo/sửa budget
 */
const BudgetForm = ({ budget, month, year, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    limit: budget?.limit || 0,
    notes: budget?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'limit' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || formData.limit < 0) {
      alert('Vui lòng nhập danh mục và ngân sách hợp lệ');
      return;
    }
    onSubmit(formData.category, formData.limit, month, year, formData.notes);
    setFormData({ category: '', limit: 0, notes: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form card" style={{ padding: '16px', marginBottom: '16px' }}>
      <h3 style={{ marginTop: 0 }}>{budget ? '✏️ Sửa ngân sách' : '➕ Tạo ngân sách'}</h3>

      {/* Danh mục */}
      <div className="form-group">
        <label htmlFor="category">Danh mục *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {CATEGORIES_LIST.map((cat) => (
            <option key={`cat-${cat.id}`} value={cat.key}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ngân sách */}
      <div className="form-group">
        <label htmlFor="limit">Ngân sách tối đa (VND) *</label>
        <input
          type="number"
          id="limit"
          name="limit"
          value={formData.limit}
          onChange={handleChange}
          min="0"
          step="100000"
          placeholder="3,000,000"
          required
        />
      </div>

      {/* Ghi chú */}
      <div className="form-group">
        <label htmlFor="notes">Ghi chú (tùy chọn)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Ví dụ: Bao gồm cả đồ uống"
          maxLength="500"
          rows="3"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          {budget ? '💾 Cập nhật' : '✅ Tạo'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ flex: 1 }}>
          ❌ Hủy
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;

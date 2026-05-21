import { useState } from 'react';
import { EXPENSE_CATEGORIES, MESSAGES } from '../../utils/constants';
import { validateExpense, trimStringValues } from '../../utils/validation';
import { getTodayDate } from '../../utils/format';

const ExpenseForm = ({ onSubmit, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState(
    initialData || {
      amount: '',
      category: 'food',
      description: '',
      date: getTodayDate(),
    }
  );
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = trimStringValues(formData);
    const validation = validateExpense(trimmed);

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

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? '💾 Cập nhật' : '➕ Thêm'}
          </button>
        </div>
      </form>

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

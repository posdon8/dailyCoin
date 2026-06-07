import { useState } from 'react';
import dayjs from 'dayjs';
import '../../styles/goal.css';

const GOAL_CATEGORIES = [
  { value: 'vacation', label: '🏖️ Du lịch' },
  { value: 'education', label: '📚 Giáo dục' },
  { value: 'car', label: '🚗 Xe hơi' },
  { value: 'home', label: '🏠 Mua nhà' },
  { value: 'emergency', label: '🆘 Quỹ khẩn cấp' },
  { value: 'investment', label: '💼 Đầu tư' },
  { value: 'other', label: '📌 Khác' },
];

const ICONS = ['💰', '🏖️', '📚', '🚗', '🏠', '💍', '🎮', '🎓', '✈️', '🏥'];
const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const GoalForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      targetAmount: '',
      category: 'other',
      deadline: dayjs().add(1, 'year').format('YYYY-MM-DD'),
      icon: '💰',
      color: '#3b82f6',
      priority: '2',
      notes: '',
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên mục tiêu';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Vui lòng nhập số tiền hợp lệ';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Vui lòng chọn thời hạn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      priority: parseInt(formData.priority),
    };

    onSubmit(submitData);
    
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        category: 'other',
        deadline: dayjs().add(1, 'year').format('YYYY-MM-DD'),
        icon: '💰',
        color: '#3b82f6',
        priority: '2',
        notes: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <h3>{initialData ? 'Chỉnh sửa mục tiêu' : 'Tạo mục tiêu mới'}</h3>

      <div className="form-group">
        <label htmlFor="title">Tên mục tiêu *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="VD: Du lịch Đà Nẵng"
          maxLength="100"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="targetAmount">Số tiền mục tiêu (VND) *</label>
          <input
            id="targetAmount"
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="VD: 10000000"
            step="100000"
            min="0"
          />
          {errors.targetAmount && <span className="error">{errors.targetAmount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Danh mục</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {GOAL_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="deadline">Thời hạn *</label>
          <input
            id="deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
          {errors.deadline && <span className="error">{errors.deadline}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Độ ưu tiên</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="1">🔴 Cao</option>
            <option value="2">🟡 Trung bình</option>
            <option value="3">🟢 Thấp</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Biểu tượng</label>
        <div className="icon-picker">
          {ICONS.map(icon => (
            <button
              key={icon}
              type="button"
              className={`icon-btn ${formData.icon === icon ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, icon }))}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Màu sắc</label>
        <div className="color-picker">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              className={`color-btn ${formData.color === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData(prev => ({ ...prev, color }))}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mô tả chi tiết về mục tiêu của bạn"
          rows="3"
          maxLength="500"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Ghi chú</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Thêm ghi chú hoặc hướng dẫn"
          rows="3"
          maxLength="1000"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Cập nhật' : 'Tạo mục tiêu'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;

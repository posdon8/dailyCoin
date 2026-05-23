import { useState } from 'react';

/**
 * Form tạo/sửa ví
 */
const WalletForm = ({ initialWallet: wallet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: wallet?.name || '',
    type: wallet?.type || 'cash',
    balance: wallet?.balance || 0,
    color: wallet?.color || '#667eea',
    icon: wallet?.icon || '💰',
    description: wallet?.description || '',
  });

  const walletTypes = [
    { value: 'cash', label: '💵 Tiền mặt' },
    { value: 'bank', label: '🏦 Tài khoản ngân hàng' },
    { value: 'digital', label: '📱 Ví điện tử' },
    { value: 'credit_card', label: '💳 Thẻ tín dụng' },
    { value: 'other', label: '🎁 Khác' },
  ];

  const walletIcons = ['💰', '💵', '🏦', '📱', '💳', '💎', '🎁', '📦'];
  const colors = [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#4facfe',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'balance' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      alert('Vui lòng nhập tên ví và loại ví');
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      type: 'cash',
      balance: 0,
      color: '#667eea',
      icon: '💰',
      description: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form card" style={{ padding: '16px', marginBottom: '16px' }}>
      <h3 style={{ marginTop: 0 }}>{wallet ? '✏️ Sửa ví' : '➕ Tạo ví mới'}</h3>

      {/* Tên ví */}
      <div className="form-group">
        <label htmlFor="name">Tên ví *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ví tiền mặt, TK Agribank, ..."
          required
        />
      </div>

      {/* Loại ví */}
      <div className="form-group">
        <label htmlFor="type">Loại ví *</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} required>
          {walletTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Số dư */}
      <div className="form-group">
        <label htmlFor="balance">Số dư ban đầu (VND)</label>
        <input
          type="number"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          min="0"
          step="100000"
          placeholder="0"
        />
      </div>

      {/* Icon */}
      <div className="form-group">
        <label htmlFor="icon">Icon</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {walletIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, icon }))}
              style={{
                fontSize: '24px',
                padding: '8px',
                border: formData.icon === icon ? '3px solid #667eea' : '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: formData.icon === icon ? '#f0f4ff' : 'white',
                cursor: 'pointer',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Màu */}
      <div className="form-group">
        <label htmlFor="color">Màu sắc</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, color }))}
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: color,
                border: formData.color === color ? '3px solid #333' : '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Mô tả */}
      <div className="form-group">
        <label htmlFor="description">Mô tả (tùy chọn)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ví dụ: Tài khoản tiền lương..."
          maxLength="500"
          rows="2"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          {wallet ? '💾 Cập nhật' : '✅ Tạo'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ flex: 1 }}>
          ❌ Hủy
        </button>
      </div>
    </form>
  );
};

export default WalletForm;

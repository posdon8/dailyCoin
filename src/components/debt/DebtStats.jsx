import React from 'react';
import { formatCurrency } from '../../utils/format';
import '../styles/DebtStats.css';

const DebtStats = ({ stats }) => {
  if (!stats || !stats.summary) {
    return null;
  }

  const { totalAmount, totalPaid, pendingAmount, overdueCount } = stats.summary;
  const remainingAmount = totalAmount - totalPaid;

  return (
    <div className="debt-stats-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-title">Tổng nợ</span>
          </div>
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">✅</span>
            <span className="stat-title">Đã thanh toán</span>
          </div>
          <div className="stat-value">{formatCurrency(totalPaid)}</div>
          <div className="stat-percentage">
            {totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⏳</span>
            <span className="stat-title">Còn lại</span>
          </div>
          <div className="stat-value">{formatCurrency(remainingAmount)}</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <span className="stat-icon">⚠️</span>
            <span className="stat-title">Quá hạn</span>
          </div>
          <div className="stat-value">{overdueCount || 0}</div>
          <div className="stat-subtitle">khoản nợ</div>
        </div>
      </div>

      {stats.stats && stats.stats.length > 0 && (
        <div className="debt-status-breakdown">
          <h3>Phân loại theo trạng thái</h3>
          <div className="status-items">
            {stats.stats.map((item) => (
              <div key={item._id} className="status-item">
                <span className="status-name">
                  {item._id === 'pending'
                    ? 'Chưa thanh toán'
                    : item._id === 'partial'
                      ? 'Thanh toán một phần'
                      : 'Đã thanh toán'}
                </span>
                <div className="status-details">
                  <span className="count">{item.count} khoản</span>
                  <span className="amount">{formatCurrency(item.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtStats;

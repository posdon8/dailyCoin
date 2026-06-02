import React from 'react';
import { formatCurrency, formatDate } from '../../utils/format';
import '../styles/DebtItem.css';

const DebtItem = ({
  debt,
  onEdit,
  onDelete,
  onPayment,
  onViewDetails,
}) => {
  const remainingAmount = debt.amount - (debt.amountPaid || 0);
  const isOverdue =
    debt.status !== 'settled' && new Date(debt.dueDate) < new Date();
  const progressPercent = (debt.amountPaid / debt.amount) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case 'settled':
        return '#28a745';
      case 'partial':
        return '#ffc107';
      case 'pending':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'settled':
        return 'Đã thanh toán';
      case 'partial':
        return 'Thanh toán một phần';
      case 'pending':
        return 'Chưa thanh toán';
      default:
        return 'Không rõ';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'low':
        return 'Thấp';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao';
      default:
        return priority;
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <div className={`debt-item ${isOverdue && debt.status !== 'settled' ? 'overdue' : ''}`}>
      <div className="debt-header">
        <div className="debt-creditor">
          <h3>{debt.debtorName}</h3>
          {debt.debtorEmail && <p className="email">{debt.debtorEmail}</p>}
        </div>
        <div className="debt-amount">
          <span className="main-amount">{formatCurrency(debt.amount)}</span>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(debt.status) }}
          >
            {getStatusLabel(debt.status)}
          </span>
        </div>
      </div>

      <div className="debt-description">
        <p>{debt.description}</p>
      </div>

      <div className="debt-details">
        <div className="detail-item">
          <span className="label">Danh mục:</span>
          <span className="value">{debt.category}</span>
        </div>
        <div className="detail-item">
          <span className="label">Ưu tiên:</span>
          <span className={`value ${getPriorityClass(debt.priority)}`}>
            {getPriorityLabel(debt.priority)}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Ngày đến hạn:</span>
          <span className={`value ${isOverdue && debt.status !== 'settled' ? 'overdue-text' : ''}`}>
            {formatDate(debt.dueDate)}
            {isOverdue && debt.status !== 'settled' && ' ⚠️ Quá hạn'}
          </span>
        </div>
      </div>

      {(debt.bankName || debt.bankAccount) && (
        <div className="debt-banking">
          <strong>💳 Thông tin thanh toán:</strong>
          <div className="bank-info">
            {debt.bankName && <p>🏦 Ngân hàng: {debt.bankName}</p>}
            {debt.bankAccount && <p>🔢 Số tài khoản: {debt.bankAccount}</p>}
          </div>
        </div>
      )}

      {debt.amountPaid > 0 && (
        <div className="debt-progress">
          <div className="progress-info">
            <span className="label">Đã thanh toán:</span>
            <span className="values">
              {formatCurrency(debt.amountPaid)} / {formatCurrency(debt.amount)}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <div className="remaining">
            Còn nợ: <strong>{formatCurrency(remainingAmount)}</strong>
          </div>
        </div>
      )}

      {debt.notes && (
        <div className="debt-notes">
          <strong>Ghi chú:</strong> {debt.notes}
        </div>
      )}

      <div className="debt-actions">
        {debt.status !== 'settled' && (
          <button className="btn btn-sm btn-success" onClick={() => onPayment(debt)}>
            Ghi nhận TT
          </button>
        )}
        <button className="btn btn-sm btn-info" onClick={() => onViewDetails(debt)}>
          Chi tiết
        </button>
        <button className="btn btn-sm btn-warning" onClick={() => onEdit(debt)}>
          Sửa
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(debt._id)}>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default DebtItem;

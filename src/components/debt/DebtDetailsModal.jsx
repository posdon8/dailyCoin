import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/format';
import '../styles/DebtDetailsModal.css';

const DebtDetailsModal = ({ debt, onClose }) => {
  const remainingAmount = debt.amount - (debt.amountPaid || 0);
  const progressPercent = (debt.amountPaid / debt.amount) * 100;

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chưa thanh toán',
      partial: 'Thanh toán một phần',
      settled: 'Đã thanh toán',
    };
    return labels[status] || status;
  };

  const isOverdue =
    debt.status !== 'settled' && new Date(debt.dueDate) < new Date();

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết khoản nợ</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="details-section">
            <h3>Thông tin cơ bản</h3>
            <div className="detail-row">
              <span className="label">Người nợ:</span>
              <span className="value">{debt.debtorName}</span>
            </div>
            {debt.debtorEmail && (
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{debt.debtorEmail}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Danh mục:</span>
              <span className="value">{debt.category}</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Thông tin tài chính</h3>
            <div className="detail-row">
              <span className="label">Tổng nợ:</span>
              <span className="value amount">{formatCurrency(debt.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Đã thanh toán:</span>
              <span className="value">{formatCurrency(debt.amountPaid || 0)}</span>
            </div>
            <div className="detail-row highlight">
              <span className="label">Còn lại:</span>
              <span className="value">{formatCurrency(remainingAmount)}</span>
            </div>

            {debt.amountPaid > 0 && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="progress-text">
                  {progressPercent.toFixed(1)}% hoàn thành
                </div>
              </div>
            )}
          </div>

          {(debt.bankName || debt.bankAccount) && (
            <div className="details-section banking-section">
              <h3>💳 Thông tin thanh toán</h3>
              {debt.bankName && (
                <div className="detail-row">
                  <span className="label">🏦 Ngân hàng:</span>
                  <span className="value">{debt.bankName}</span>
                </div>
              )}
              {debt.bankAccount && (
                <div className="detail-row">
                  <span className="label">🔢 Số tài khoản:</span>
                  <span className="value bank-account">{debt.bankAccount}</span>
                </div>
              )}
            </div>
          )}

          <div className="details-section">
            <h3>Thời hạn & Trạng thái</h3>
            <div className="detail-row">
              <span className="label">Ngày đến hạn:</span>
              <span className={`value ${isOverdue ? 'overdue-text' : ''}`}>
                {formatDate(debt.dueDate)}
                {isOverdue && ' ⚠️ Quá hạn'}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Trạng thái:</span>
              <span className="value status">{getStatusLabel(debt.status)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ưu tiên:</span>
              <span className="value">{debt.priority}</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Mô tả</h3>
            <p className="description">{debt.description}</p>
          </div>

          {debt.notes && (
            <div className="details-section">
              <h3>Ghi chú</h3>
              <p className="notes">{debt.notes}</p>
            </div>
          )}

          {debt.tags && debt.tags.length > 0 && (
            <div className="details-section">
              <h3>Thẻ</h3>
              <div className="tags">
                {debt.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="details-section">
            <h3>Thông tin thêm</h3>
            <div className="detail-row">
              <span className="label">Ngày tạo:</span>
              <span className="value">{formatDate(debt.createdAt)}</span>
            </div>
            {debt.updatedAt !== debt.createdAt && (
              <div className="detail-row">
                <span className="label">Cập nhật lần cuối:</span>
                <span className="value">{formatDate(debt.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtDetailsModal;

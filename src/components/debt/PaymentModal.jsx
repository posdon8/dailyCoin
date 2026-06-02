import React, { useState } from 'react';
import { formatCurrency } from '../../utils/format';
import '../styles/PaymentModal.css';

const PaymentModal = ({ debt, onConfirm, onCancel }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [error, setError] = useState('');

  const remainingAmount = debt.amount - (debt.amountPaid || 0);
  const maxPayment = Math.min(remainingAmount, debt.amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(paymentAmount);

    if (!paymentAmount || amount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (amount > remainingAmount) {
      setError(`Số tiền vượt quá số tiền còn lại: ${formatCurrency(remainingAmount)}`);
      return;
    }

    onConfirm(amount, sendNotification);
  };

  const handleQuickPayment = (amount) => {
    setPaymentAmount(amount.toString());
    setError('');
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h2>Ghi nhận thanh toán</h2>

        <div className="payment-info">
          <div className="info-row">
            <span className="label">Người nợ:</span>
            <span className="value">{debt.debtorName}</span>
          </div>
          <div className="info-row">
            <span className="label">Tổng nợ:</span>
            <span className="value">{formatCurrency(debt.amount)}</span>
          </div>
          <div className="info-row">
            <span className="label">Đã thanh toán:</span>
            <span className="value">{formatCurrency(debt.amountPaid || 0)}</span>
          </div>
          <div className="info-row highlight">
            <span className="label">Còn lại:</span>
            <span className="value">{formatCurrency(remainingAmount)}</span>
          </div>
        </div>

        {(debt.bankName || debt.bankAccount) && (
          <div className="bank-info-section">
            <strong>💳 Thông tin thanh toán:</strong>
            {debt.bankName && <p>🏦 Ngân hàng: {debt.bankName}</p>}
            {debt.bankAccount && <p>🔢 Số tài khoản: {debt.bankAccount}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="paymentAmount">Số tiền thanh toán (VND) *</label>
            <input
              id="paymentAmount"
              type="number"
              value={paymentAmount}
              onChange={(e) => {
                setPaymentAmount(e.target.value);
                setError('');
              }}
              placeholder="0"
              min="0"
              max={maxPayment}
              step="1000"
              className={error ? 'error' : ''}
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="quick-payment-buttons">
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickPayment(remainingAmount / 2)}
              title="Thanh toán 50%"
            >
              50%
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickPayment(remainingAmount / 4)}
              title="Thanh toán 25%"
            >
              25%
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickPayment(remainingAmount)}
              title="Thanh toán toàn bộ"
            >
              Toàn bộ
            </button>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <span>📧 Gửi email xác nhận cho người nợ</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Xác nhận
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;

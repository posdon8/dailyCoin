import React from 'react';
import DebtItem from './DebtItem';
import '../styles/DebtList.css';

const DebtList = ({
  debts,
  onEdit,
  onDelete,
  onPayment,
  onViewDetails,
  filter = 'all',
  loading = false,
}) => {
  if (loading) {
    return <div className="debt-list-loading">Đang tải...</div>;
  }

  if (!debts || debts.length === 0) {
    return (
      <div className="debt-list-empty">
        <p>Không có khoản nợ nào</p>
      </div>
    );
  }

  const filteredDebts = debts.filter((debt) => {
    if (filter === 'overdue') {
      return debt.status !== 'settled' && new Date(debt.dueDate) < new Date();
    }
    if (filter === 'pending') {
      return debt.status === 'pending';
    }
    if (filter === 'partial') {
      return debt.status === 'partial';
    }
    if (filter === 'settled') {
      return debt.status === 'settled';
    }
    return true;
  });

  if (filteredDebts.length === 0) {
    return (
      <div className="debt-list-empty">
        <p>Không có khoản nợ nào phù hợp với bộ lọc</p>
      </div>
    );
  }

  return (
    <div className="debt-list">
      {filteredDebts.map((debt) => (
        <DebtItem
          key={debt._id}
          debt={debt}
          onEdit={onEdit}
          onDelete={onDelete}
          onPayment={onPayment}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default DebtList;

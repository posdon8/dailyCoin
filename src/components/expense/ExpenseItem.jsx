import { EXPENSE_CATEGORIES, MESSAGES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/format';

const ExpenseItem = ({ expense, onDelete, onEdit }) => {
  const category = EXPENSE_CATEGORIES[expense.category] || EXPENSE_CATEGORIES.other;

  const handleDelete = () => {
    if (window.confirm(MESSAGES.deleteConfirm)) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="expense-item">
      <div className="item-icon">{category.icon}</div>

      <div className="item-content">
        <div className="item-header">
          <h3 className="item-category">{category.label}</h3>
          <span className="item-date">{formatDate(expense.date)}</span>
        </div>
        <p className="item-description">{expense.description}</p>
      </div>

      <div className="item-amount">{formatCurrency(expense.amount)}</div>

      <div className="item-actions">
        <button
          className="btn btn-small"
          style={{ backgroundColor: '#3498db', color: 'white', border: 'none' }}
          onClick={() => onEdit(expense)}
          title="Sửa"
        >
          ✏️
        </button>
        <button
          className="btn btn-small"
          style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none' }}
          onClick={handleDelete}
          title="Xóa"
        >
          🗑️
        </button>
      </div>

      <style>{`
        .expense-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #ecf0f1;
          transition: var(--transition);
        }

        .expense-item:hover {
          box-shadow: var(--shadow);
          border-color: #bdc3c7;
        }

        .item-icon {
          font-size: 1.5rem;
          min-width: 40px;
          text-align: center;
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .item-category {
          margin: 0;
          font-size: 1rem;
          color: var(--text);
        }

        .item-date {
          font-size: 0.875rem;
          color: #7f8c8d;
          white-space: nowrap;
        }

        .item-description {
          margin: 4px 0 0 0;
          font-size: 0.875rem;
          color: #7f8c8d;
          word-break: break-word;
        }

        .item-amount {
          font-size: 1.125rem;
          font-weight: 600;
          color: #e74c3c;
          min-width: max-content;
          white-space: nowrap;
        }

        .item-actions {
          display: flex;
          gap: 6px;
          white-space: nowrap;
        }

        .item-actions button {
          padding: 6px 10px;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .expense-item {
            flex-wrap: wrap;
            gap: 8px;
          }

          .item-header {
            width: 100%;
            order: -1;
          }

          .item-icon {
            order: -2;
          }

          .item-content {
            order: -1;
            width: 100%;
          }

          .item-amount {
            flex: 1;
            order: 1;
          }

          .item-actions {
            order: 2;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpenseItem;

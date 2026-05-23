import { EXPENSE_CATEGORIES, CURRENCY, CATEGORIES_LIST } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';

/**
 * Thẻ budget với progress bar
 */
const BudgetCard = ({ budget, onEdit, onDelete }) => {
const category = CATEGORIES_LIST.find(c => c.id === budget.category);
  const percentage = budget.percentage || 0;
  
  const getStatusColor = () => {
    if (percentage >= 100) return '#ef4444'; // red
    if (percentage >= 80) return '#f97316'; // orange
    return '#10b981'; // green
  };

  const getStatusText = () => {
    if (percentage >= 100) return '❌ Vượt ngân sách';
    if (percentage >= 80) return '⚠️ Cảnh báo';
    return '✅ Bình thường';
  };

  return (
    <div
      className="budget-card"
      style={{
        border: `3px solid ${getStatusColor()}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: 'white',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '32px' }}>{category?.icon}</span>
          <div>
            <h3 className="font-bold" style={{ margin: 0 }}>
              {category?.label}
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '12px' }}>
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-small btn-primary"
            onClick={() => onEdit(budget)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            ✏️
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={() => onDelete(budget._id)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          backgroundColor: '#e5e7eb',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: getStatusColor(),
            width: `${Math.min(percentage, 100)}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center" style={{ fontSize: '12px' }}>
        <span>
          <strong>{formatCurrency(budget.spent || 0)}</strong> / {formatCurrency(budget.limit)}
        </span>
        <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {Math.min(percentage, 100).toFixed(0)}%
        </span>
      </div>

      {budget.remaining < 0 && (
        <p style={{ margin: '8px 0 0 0', color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>
          ⚠️ Vượt: {formatCurrency(Math.abs(budget.remaining))}
        </p>
      )}

      {budget.remaining >= 0 && percentage >= 80 && (
        <p style={{ margin: '8px 0 0 0', color: '#f97316', fontSize: '12px' }}>
          💡 Còn lại: {formatCurrency(budget.remaining)}
        </p>
      )}
    </div>
  );
};

export default BudgetCard;

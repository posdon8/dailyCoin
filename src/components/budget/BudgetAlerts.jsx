import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';

/**
 * Hiển thị cảnh báo ngân sách
 */
const BudgetAlerts = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      {alerts.map((alert, index) => {
        const category = EXPENSE_CATEGORIES.find((c) => c.key === alert.category);
        const isExceeded = alert.type === 'exceeded';
        const bgColor = isExceeded ? '#fee2e2' : '#fef3c7';
        const borderColor = isExceeded ? '#ef4444' : '#f59e0b';
        const textColor = isExceeded ? '#991b1b' : '#92400e';

        return (
          <div
            key={`${index}-${alert.category}`}
            style={{
              backgroundColor: bgColor,
              border: `2px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px',
              color: textColor,
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2" style={{ flex: 1 }}>
                <span style={{ fontSize: '20px' }}>
                  {isExceeded ? '🚨' : '⚠️'}
                </span>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
                    {alert.message}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                    {formatCurrency(alert.spent)} / {formatCurrency(alert.limit)} ({alert.percentage}%)
                  </p>
                </div>
              </div>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '0',
                  color: textColor,
                }}
                onClick={() => onDismiss && onDismiss(alert.category)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetAlerts;

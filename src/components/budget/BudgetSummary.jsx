import { formatCurrency } from '../../utils/format';

/**
 * Tóm tắt ngân sách toàn bộ
 */
const BudgetSummary = ({ summary, loading }) => {
  if (loading || !summary) {
    return null;
  }

  const { totalBudget, totalSpent, totalRemaining, overallPercentage } = summary;

  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0' }}>📊 Tóm tắt ngân sách tháng</h3>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', opacity: 0.9 }}>Tổng ngân sách</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {formatCurrency(totalBudget)}
          </p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', opacity: 0.9 }}>Đã chi tiêu</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      {/* Progress bar tổng */}
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.3)',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'white',
            width: `${Math.min(overallPercentage, 100)}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div className="flex justify-between items-center" style={{ fontSize: '12px' }}>
        <span>
          💰 Còn lại: <strong>{formatCurrency(totalRemaining)}</strong>
        </span>
        <span style={{ fontWeight: 'bold' }}>{overallPercentage}%</span>
      </div>
    </div>
  );
};

export default BudgetSummary;

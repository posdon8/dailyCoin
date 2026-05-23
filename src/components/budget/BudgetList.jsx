import BudgetCard from './BudgetCard';

/**
 * Danh sách tất cả budget
 */
const BudgetList = ({ budgets, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        ⏳ Đang tải...
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderLeft: '4px solid #9ca3af',
        }}
      >
        <p style={{ margin: 0, color: '#666' }}>
          📭 Chưa có ngân sách nào<br />
          <span style={{ fontSize: '12px' }}>Nhấn "➕ Tạo ngân sách" để bắt đầu</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {budgets.map((budget) => (
        <BudgetCard
          key={budget._id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;

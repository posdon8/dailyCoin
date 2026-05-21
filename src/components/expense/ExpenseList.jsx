import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDelete, onEdit, loading = false }) => {
  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '16px', color: '#7f8c8d' }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '1.1rem', color: '#7f8c8d', margin: 0 }}>
            📭 Không có chi tiêu nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h2 className="list-title">📝 Danh sách chi tiêu ({expenses.length})</h2>
      <div className="expense-items">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      <style>{`
        .expense-list {
          margin-top: 24px;
        }

        .list-title {
          margin-bottom: 16px;
          color: var(--text);
        }

        .expense-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};

export default ExpenseList;

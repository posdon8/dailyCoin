import { useState, useEffect } from 'react';
import BudgetForm from '../components/budget/BudgetForm';
import BudgetList from '../components/budget/BudgetList';
import BudgetSummary from '../components/budget/BudgetSummary';
import BudgetAlerts from '../components/budget/BudgetAlerts';
import { useBudgets } from '../hooks/useBudgets';
import { useNotification } from '../context/NotificationContext';

const BudgetPage = () => {
  const [editingId, setEditingId] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const { 
  budgets, 
  summary, 
  loading, 
  error,
  loadBudgets,
  saveBudget,          // addBudget → saveBudget
  deleteBudget,
  loadBudgetSummary,   // loadSummary → loadBudgetSummary
} = useBudgets();
  
  const { showNotification } = useNotification();

  // Load budgets khi mount hoặc khi month/year thay đổi
  useEffect(() => {
  loadBudgets(month, year);
  loadBudgetSummary(month, year);  // ✅
}, [month, year]);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      showNotification(`❌ Lỗi: ${error}`, 'danger');
    }
  }, [error, showNotification]);

  const handleAddBudget = async (category, limit, month, year, notes) => {
  try {
    await saveBudget(category, limit, month, year, notes);
    showNotification('✅ Tạo ngân sách thành công', 'success');
    await loadBudgets(month, year);
    await loadBudgetSummary(month, year);
  } catch (err) {
    showNotification(`❌ Lỗi: ${err.message}`, 'danger');
  }
};

const handleUpdateBudget = async (budgetId, category, limit, month, year, notes) => {
  try {
    await saveBudget(category, limit, month, year, notes);
    showNotification('✅ Cập nhật ngân sách thành công', 'success');
    setEditingId(null);
    await loadBudgets(month, year);
    await loadBudgetSummary(month, year);
  } catch (err) {
    showNotification(`❌ Lỗi: ${err.message}`, 'danger');
  }
};

// handleDeleteBudget — reload sau khi xóa
const handleDeleteBudget = async (budgetId) => {
  try {
    await deleteBudget(budgetId);
    showNotification('✅ Xóa ngân sách thành công', 'success');
    await loadBudgets(month, year);
    await loadBudgetSummary(month, year);  // ✅
  } catch (err) {
    showNotification(`❌ Lỗi: ${err.message}`, 'danger');
  }
};

  const handleEditClick = (budget) => {
    setEditingId(budget._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const editingBudget = editingId ? budgets.find((b) => b._id === editingId) : null;

  return (
    <div className="container p-3">
      {/* Header với chọn tháng/năm */}
      <div className="card mb-4">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label htmlFor="month-select" style={{ fontWeight: 'bold' }}>
            Tháng:
          </label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="form-control"
            style={{ width: '100px' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <label htmlFor="year-select" style={{ fontWeight: 'bold', marginLeft: '20px' }}>
            Năm:
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="form-control"
            style={{ width: '100px' }}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - 2 + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Tóm tắt ngân sách */}
      {summary && <BudgetSummary summary={summary} />}

      {/* Cảnh báo vượt ngân sách */}
      {budgets && budgets.length > 0 && <BudgetAlerts budgets={budgets} />}

      {/* Form tạo/sửa ngân sách */}
      <div className="card mb-4">
        <h3>
          {editingId ? '✏️ Chỉnh sửa ngân sách' : '➕ Tạo ngân sách mới'}
        </h3>
        <BudgetForm
          initialBudget={editingBudget}
          month={month}
          year={year}
          onSubmit={editingId
            ? (cat, lim, m, y, notes) => handleUpdateBudget(editingId, cat, lim, m, y, notes)
            : handleAddBudget
          }
          onCancel={editingId ? handleCancelEdit : null}
        />
      </div>

      {/* Danh sách ngân sách */}
      <div className="card">
        <h3>📋 Danh sách ngân sách</h3>
        <BudgetList
          budgets={budgets}
          onEdit={handleEditClick}
          onDelete={handleDeleteBudget}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BudgetPage;

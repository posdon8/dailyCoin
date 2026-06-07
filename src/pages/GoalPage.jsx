import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import GoalForm from '../components/goal/GoalForm';
import GoalList from '../components/goal/GoalList';
import GoalStats from '../components/goal/GoalStats';
import Loading from '../components/common/Loading';
import '../styles/goal.css';

const GoalPage = ({ goals, onCreateGoal, onUpdateGoal, onDeleteGoal, onAddAmount, stats, loading = false }) => {
  const { showNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const handleFormSubmit = async (formData) => {
    try {
      if (editingGoal) {
        await onUpdateGoal(editingGoal._id, formData);
        showNotification('✅ Cập nhật mục tiêu thành công');
        setEditingGoal(null);
      } else {
        await onCreateGoal(formData);
        showNotification('✅ Tạo mục tiêu thành công');
      }
      setShowForm(false);
    } catch (error) {
      showNotification(`❌ Lỗi: ${error.message}`, 'danger');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
      try {
        await onDeleteGoal(id);
        showNotification('✅ Xóa mục tiêu thành công');
      } catch (error) {
        showNotification(`❌ Lỗi: ${error.message}`, 'danger');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setShowForm(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="goal-page">
      <div className="page-header">
        <h1>💰 Mục tiêu tiết kiệm</h1>
        <p>Lập kế hoạch tài chính và theo dõi tiến độ tiết kiệm của bạn</p>
      </div>

      {stats && <GoalStats stats={stats} />}

      <div className="goal-controls">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingGoal(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? '❌ Đóng form' : '➕ Tạo mục tiêu mới'}
        </button>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Đang thực hiện
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {showForm && (
        <GoalForm
          onSubmit={handleFormSubmit}
          initialData={editingGoal}
          onCancel={handleCancelEdit}
        />
      )}

      <GoalList
        goals={goals}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        onAddAmount={onAddAmount}
        filter={filter}
      />
    </div>
  );
};

export default GoalPage;

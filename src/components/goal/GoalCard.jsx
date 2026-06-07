import dayjs from 'dayjs';
import '../../styles/goal.css';

const GoalCard = ({ goal, onEdit, onDelete, onAddAmount }) => {
  const progress = goal.progressPercentage || 0;
  const remaining = goal.remainingAmount || 0;
  const daysLeft = goal.daysRemaining || 0;

  return (
    <div className="goal-card" style={{ borderLeftColor: goal.color }}>
      <div className="goal-header">
        <div className="goal-title">
          <span className="goal-icon">{goal.icon}</span>
          <div>
            <h3>{goal.title}</h3>
            <p className="goal-category">{goal.category}</p>
          </div>
        </div>
        <div className="goal-actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(goal)}
            title="Chỉnh sửa"
          >
            ✏️
          </button>
          <button
            className="btn-icon danger"
            onClick={() => onDelete(goal._id)}
            title="Xóa"
          >
            🗑️
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="goal-description">{goal.description}</p>
      )}

      <div className="goal-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: goal.color,
            }}
          />
        </div>
        <div className="progress-text">
          <span className="progress-percentage">{progress}%</span>
          <span className="progress-amount">
            {goal.currentAmount.toLocaleString('vi-VN')} / {goal.targetAmount.toLocaleString('vi-VN')} VND
          </span>
        </div>
      </div>

      <div className="goal-stats">
        <div className="stat">
          <span className="label">Còn thiếu</span>
          <span className="value" style={{ color: goal.color }}>
            {remaining.toLocaleString('vi-VN')} VND
          </span>
        </div>
        <div className="stat">
          <span className="label">Thời hạn</span>
          <span className="value">
            {dayjs(goal.deadline).format('DD/MM/YYYY')}
          </span>
        </div>
        <div className="stat">
          <span className="label">Còn lại</span>
          <span className={`value ${daysLeft <= 7 ? 'urgent' : ''}`}>
            {daysLeft} ngày
          </span>
        </div>
      </div>

      {!goal.isCompleted && remaining > 0 && (
        <div className="goal-add-amount">
          <input
            type="number"
            placeholder="Nhập số tiền"
            id={`amount-${goal._id}`}
            min="0"
            step="100000"
          />
          <button
            className="btn btn-small"
            onClick={() => {
              const input = document.getElementById(`amount-${goal._id}`);
              const amount = parseFloat(input.value);
              if (amount > 0) {
                onAddAmount(goal._id, amount);
                input.value = '';
              }
            }}
          >
            Thêm tiền
          </button>
        </div>
      )}

      {goal.isCompleted && (
        <div className="goal-completed">
          <span className="badge">✅ Hoàn thành vào {dayjs(goal.completedAt).format('DD/MM/YYYY')}</span>
        </div>
      )}

      {goal.notes && (
        <div className="goal-notes">
          <p className="note-label">Ghi chú:</p>
          <p>{goal.notes}</p>
        </div>
      )}
    </div>
  );
};

export default GoalCard;

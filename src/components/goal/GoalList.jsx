import GoalCard from './GoalCard';
import '../../styles/goal.css';

const GoalList = ({ goals, onEdit, onDelete, onAddAmount, filter = 'all' }) => {
  let filteredGoals = goals;

  if (filter === 'active') {
    filteredGoals = goals.filter(g => !g.isCompleted);
  } else if (filter === 'completed') {
    filteredGoals = goals.filter(g => g.isCompleted);
  }

  // Sort by priority and deadline
  filteredGoals = [...filteredGoals].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });

  if (filteredGoals.length === 0) {
    return (
      <div className="empty-state">
        <p>📌 Không có mục tiêu nào</p>
        <small>Hãy tạo mục tiêu tiết kiệm đầu tiên của bạn</small>
      </div>
    );
  }

  return (
    <div className="goal-list">
      {filteredGoals.map(goal => (
        <GoalCard
          key={goal._id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddAmount={onAddAmount}
        />
      ))}
    </div>
  );
};

export default GoalList;

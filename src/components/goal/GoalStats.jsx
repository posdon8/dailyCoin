import '../../styles/goal.css';

const GoalStats = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="goal-stats-container">
      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <span className="stat-label">Tổng mục tiêu</span>
          <span className="stat-value">{stats.totalGoals}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <span className="stat-label">Hoàn thành</span>
          <span className="stat-value">{stats.completedGoals}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <span className="stat-label">Đang thực hiện</span>
          <span className="stat-value">{stats.activeGoals}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <span className="stat-label">Tiến độ chung</span>
          <span className="stat-value">{stats.overallProgress}%</span>
          <div className="mini-progress-bar">
            <div
              className="mini-progress-fill"
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="stat-card wide">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <span className="stat-label">Tiền đã tiết kiệm / Mục tiêu</span>
          <span className="stat-value">
            {stats.totalCurrentAmount.toLocaleString('vi-VN')} / {stats.totalTargetAmount.toLocaleString('vi-VN')} VND
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalStats;

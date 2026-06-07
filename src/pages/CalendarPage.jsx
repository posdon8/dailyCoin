import { useState } from 'react';
import dayjs from 'dayjs';
import CalendarView from '../components/calendar/CalendarView';
import ExpenseList from '../components/expense/ExpenseList';
import Loading from '../components/common/Loading';
import '../styles/calendar.css';

const CalendarPage = ({ expenses, onUpdateExpense, onDeleteExpense, loading = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateStr = dayjs(selectedDate).format('YYYY-MM-DD');
  const dayExpenses = expenses
    .filter(exp => dayjs(exp.date).format('YYYY-MM-DD') === selectedDateStr)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate monthly stats
  const currentMonth = dayjs(selectedDate).format('YYYY-MM');
  const monthExpenses = expenses.filter(exp => dayjs(exp.date).format('YYYY-MM') === currentMonth);
  const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDaily = monthExpenses.length > 0 ? Math.round(monthTotal / 30) : 0;

  // Category breakdown for selected day
  const categoryBreakdown = {};
  dayExpenses.forEach(exp => {
    if (!categoryBreakdown[exp.category]) {
      categoryBreakdown[exp.category] = 0;
    }
    categoryBreakdown[exp.category] += exp.amount;
  });

  const categoryEmojis = {
    food: '🍽️',
    transport: '🚗',
    shopping: '🛍️',
    entertainment: '🎮',
    other: '📌',
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>📅 Xem lịch chi tiêu</h1>
        <p>Theo dõi chi tiêu hàng ngày trên lịch tương tác</p>
      </div>

      <div className="calendar-container">
        <CalendarView
          expenses={expenses}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <div className="calendar-stats-row">
        <div className="stat-box">
          <div className="stat-label">Ngày được chọn</div>
          <div className="stat-date">{dayjs(selectedDate).format('DD/MM/YYYY')}</div>
        </div>

        <div className="stat-box highlight">
          <div className="stat-label">Chi tiêu hôm nay</div>
          <div className="stat-amount">{dayTotal.toLocaleString('vi-VN')} VND</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Tổng tháng này</div>
          <div className="stat-amount">{monthTotal.toLocaleString('vi-VN')} VND</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Bình quân/ngày</div>
          <div className="stat-amount">{avgDaily.toLocaleString('vi-VN')} VND</div>
        </div>
      </div>

      {dayExpenses.length > 0 && (
        <div className="calendar-details">
          <div className="details-section">
            <h3>📊 Chi tiêu theo danh mục ({selectedDateStr})</h3>
            <div className="category-breakdown">
              {Object.entries(categoryBreakdown).map(([category, amount]) => (
                <div key={category} className="category-item">
                  <span className="category-name">
                    {categoryEmojis[category] || '📌'} {category}
                  </span>
                  <span className="category-amount">
                    {amount.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h3>💳 Chi tiêu chi tiết ({selectedDateStr})</h3>
            <ExpenseList
              expenses={dayExpenses}
              onUpdateExpense={onUpdateExpense}
              onDeleteExpense={onDeleteExpense}
              showDelete={true}
            />
          </div>
        </div>
      )}

      {dayExpenses.length === 0 && (
        <div className="empty-state">
          <p>📭 Không có chi tiêu nào vào ngày này</p>
          <small>Chọn ngày khác hoặc tạo chi tiêu mới</small>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

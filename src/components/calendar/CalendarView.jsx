import { useState } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import '../../styles/calendar.css';

dayjs.extend(weekOfYear);

const CalendarView = ({ expenses, selectedDate, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(dayjs(selectedDate || new Date()));

  const firstDay = currentDate.startOf('month');
  const lastDay = currentDate.endOf('month');
  const daysInMonth = lastDay.date();
  const startDate = firstDay.day(); // 0 = Sunday

  // Get expenses by date for this month
  const expensesByDate = {};
  expenses.forEach(exp => {
    const dateKey = dayjs(exp.date).format('YYYY-MM-DD');
    if (!expensesByDate[dateKey]) {
      expensesByDate[dateKey] = [];
    }
    expensesByDate[dateKey].push(exp);
  });

  // Calculate daily totals
  const dailyTotals = {};
  Object.keys(expensesByDate).forEach(dateKey => {
    dailyTotals[dateKey] = expensesByDate[dateKey].reduce((sum, exp) => sum + exp.amount, 0);
  });

  // Create calendar grid
  const days = [];
  for (let i = 0; i < startDate; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="nav-btn" onClick={goToPreviousMonth}>◀</button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <button className="nav-btn" onClick={goToNextMonth}>▶</button>
        <button className="today-btn" onClick={goToToday}>Hôm nay</button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">CN</div>
        <div className="weekday">T2</div>
        <div className="weekday">T3</div>
        <div className="weekday">T4</div>
        <div className="weekday">T5</div>
        <div className="weekday">T6</div>
        <div className="weekday">T7</div>
      </div>

      <div className="calendar-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => {
              const dateStr = day
                ? currentDate
                    .date(day)
                    .format('YYYY-MM-DD')
                : null;
              const dayExpenses = dateStr ? expensesByDate[dateStr] || [] : [];
              const dayTotal = dateStr ? dailyTotals[dateStr] || 0 : 0;
              const isToday = dateStr === dayjs().format('YYYY-MM-DD');
              const isSelected = dateStr === dayjs(selectedDate).format('YYYY-MM-DD');
              const isCurrentMonth = day !== null;

              return (
                <div
                  key={dayIndex}
                  className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${
                    isToday ? 'today' : ''
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (dateStr) {
                      onDateSelect(new Date(dateStr));
                    }
                  }}
                >
                  {day && (
                    <>
                      <div className="day-number">{day}</div>
                      {dayExpenses.length > 0 && (
                        <>
                          <div className="day-count">{dayExpenses.length} chi tiêu</div>
                          <div className="day-total">
                            {dayTotal.toLocaleString('vi-VN')} VND
                          </div>
                        </>
                      )}
                      {dayExpenses.length === 0 && dayTotal === 0 && (
                        <div className="day-empty">Không có</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color today"></div>
          <span>Hôm nay</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Ngày được chọn</span>
        </div>
        <div className="legend-item">
          <div className="legend-color has-expenses"></div>
          <span>Có chi tiêu</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

import { getTodayDate, formatDate, getMonthYearText } from '../../utils/format';
import SummaryCard from './SummaryCard';
import CategoryChart from './CategoryChart';
import TrendChart from './TrendChart';

const Dashboard = ({ expenses = [] }) => {
  // Tính thống kê tổng quát
  const today = getTodayDate();
  const todayExpenses = expenses.filter((exp) => exp.date === today);
  const thisMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return (
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    );
  });

  const totalToday = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMonth = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalAll = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Tính chi tiêu theo danh mục (tháng này)
  const categoryData = Object.keys(
    thisMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  ).map((cat) => ({
    name: cat,
    value: thisMonthExpenses.reduce((sum, exp) => sum + (exp.category === cat ? exp.amount : 0), 0),
  }));

  // Tính chi tiêu theo ngày (7 ngày gần nhất)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const trendData = last7Days.map((date) => ({
    date: formatDate(date, 'DD/MM'),
    amount: expenses
      .filter((exp) => exp.date === date)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: '24px', color: 'var(--text)' }}>📊 Tổng quan</h1>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Hôm nay"
          amount={totalToday}
          icon="📅"
          color="#e74c3c"
        />
        <SummaryCard
          title={`${getMonthYearText(today)}`}
          amount={totalMonth}
          icon="📆"
          color="#667eea"
        />
        <SummaryCard
          title="Tổng cộng"
          amount={totalAll}
          icon="💰"
          color="#27ae60"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <CategoryChart data={categoryData} />
        <TrendChart data={trendData} type="line" />
      </div>

      <style>{`
        .dashboard {
          padding: 20px 0;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

import dayjs from 'dayjs';
import { formatCurrency, getMonthYearText } from '../../utils/format';
import { MONTHS, MONTH_SHORT } from '../../utils/constants';

const MonthlyStats = ({ expenses = [] }) => {
  // Tính chi tiêu theo tháng
  const monthlyData = Array.from({ length: 12 }, (_, monthIndex) => {
    const month = monthIndex + 1;
    const year = new Date().getFullYear();
    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() + 1 === month && expDate.getFullYear() === year;
    });
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      month: MONTHS[monthIndex],
      monthShort: MONTH_SHORT[monthIndex],
      total,
      count: monthExpenses.length,
    };
  });

  const totalYear = monthlyData.reduce((sum, m) => sum + m.total, 0);
  const avgMonth = Math.round(totalYear / 12);

  return (
    <div className="card">
      <h2 className="card-header">📅 Thống kê theo tháng ({new Date().getFullYear()})</h2>

      <div className="monthly-table">
        <table>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Số chi tiêu</th>
              <th>Tổng tiền</th>
              <th>Biểu đồ</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((month, idx) => (
              <tr key={idx} className={month.total > 0 ? 'has-data' : ''}>
                <td className="month-name">{month.month}</td>
                <td className="month-count">{month.count}</td>
                <td className="month-amount">{formatCurrency(month.total)}</td>
                <td className="month-bar">
                  <div className="bar-container">
                    <div
                      className="bar"
                      style={{
                        width: totalYear > 0 ? `${(month.total / totalYear) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td className="month-name" style={{ fontWeight: 600 }}>
                Tổng năm
              </td>
              <td className="month-count" style={{ fontWeight: 600 }}>
                {expenses.filter((e) => new Date(e.date).getFullYear() === new Date().getFullYear()).length}
              </td>
              <td className="month-amount" style={{ fontWeight: 600, color: '#e74c3c' }}>
                {formatCurrency(totalYear)}
              </td>
              <td colSpan="1" style={{ textAlign: 'right', paddingRight: '12px' }}>
                <span className="avg-badge">Tb: {formatCurrency(avgMonth)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .monthly-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background-color: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #ecf0f1;
          font-size: 0.9rem;
          color: var(--text);
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #ecf0f1;
          font-size: 0.95rem;
        }

        tr:hover {
          background-color: #f8f9fa;
        }

        tr.total-row {
          background-color: #f0f4f8;
          font-weight: 600;
        }

        tr.total-row td {
          border-top: 2px solid #ecf0f1;
          border-bottom: 2px solid #ecf0f1;
        }

        tr:hover.total-row {
          background-color: #e8eef5;
        }

        .month-name {
          font-weight: 500;
          color: var(--text);
        }

        .month-count {
          text-align: center;
          color: #667eea;
        }

        .month-amount {
          font-weight: 600;
          color: #e74c3c;
        }

        .month-bar {
          width: 120px;
        }

        .bar-container {
          background-color: #ecf0f1;
          border-radius: 4px;
          height: 20px;
          overflow: hidden;
        }

        .bar {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
          min-width: 2px;
        }

        .avg-badge {
          background-color: #ffeaa7;
          color: #d68910;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          table {
            font-size: 0.85rem;
          }

          th,
          td {
            padding: 8px;
          }

          .month-bar {
            width: 80px;
          }

          .avg-badge {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MonthlyStats;

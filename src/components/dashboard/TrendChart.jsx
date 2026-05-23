import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const TrendChart = ({ data = [], type = 'line' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h2 className="card-header">📈 Xu hướng chi tiêu</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
          Không có dữ liệu
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>
            {payload[0].payload.date}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#667eea', fontWeight: 600 }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="card-header">📈 Xu hướng chi tiêu</h2>
      <div style={{ width: '100%', height: 300, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#7f8c8d"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis stroke="#7f8c8d" style={{ fontSize: '0.875rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 4 }}
                activeDot={{ r: 6 }}
                name="Chi tiêu"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                stroke="#7f8c8d"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis stroke="#7f8c8d" style={{ fontSize: '0.875rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="amount"
                fill="#667eea"
                radius={[8, 8, 0, 0]}
                name="Chi tiêu"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;

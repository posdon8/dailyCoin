import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';

const CategoryChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h2 className="card-header">📊 Chi tiêu theo danh mục</h2>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#7f8c8d' }}>
          Không có dữ liệu
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: EXPENSE_CATEGORIES[item.name]?.label || 'Khác',
    value: item.value,
    color: EXPENSE_CATEGORIES[item.name]?.color || '#999',
  }));

  const colors = chartData.map((item) => item.color);

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
            {payload[0].name}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#e74c3c', fontWeight: 600 }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="card-header">📊 Chi tiêu theo danh mục</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;

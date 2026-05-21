import { useState } from 'react';
import MonthlyStats from '../components/dashboard/MonthlyStats';
import { exportData } from '../utils/storage';

const AnalyticsPage = ({ expenses = [] }) => {
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = () => {
    try {
      const data = exportData();
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
      );
      element.setAttribute(
        'download',
        `chi-tieu-${new Date().toISOString().split('T')[0]}.json`
      );
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setExportMessage('✓ Xuất dữ liệu thành công');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage('❌ Lỗi khi xuất dữ liệu');
    }
  };

  return (
    <div className="container p-3">
      <div className="flex-between mb-3">
        <h1 style={{ margin: 0 }}>📊 Phân tích chi tiêu</h1>
        <button className="btn btn-primary" onClick={handleExport}>
          💾 Tải dữ liệu
        </button>
      </div>

      {exportMessage && (
        <div className={`alert alert-${exportMessage.includes('✓') ? 'success' : 'danger'} mb-3`}>
          {exportMessage}
        </div>
      )}

      <MonthlyStats expenses={expenses} />

      <div className="mt-3" style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ Thông tin</h3>
        <ul style={{ paddingLeft: '20px', color: '#7f8c8d', lineHeight: 1.8 }}>
          <li>Tổng số chi tiêu: <strong>{expenses.length}</strong></li>
          <li>Chi tiêu năm nay: <strong>{expenses.filter(e => new Date(e.date).getFullYear() === new Date().getFullYear()).length}</strong></li>
          <li>Tổng tiền chi: <strong>{new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
          }).format(expenses.reduce((sum, e) => sum + e.amount, 0))}</strong></li>
        </ul>
      </div>

      <style>{`
        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .flex-between {
            flex-direction: column;
            align-items: flex-start;
          }

          .flex-between button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;

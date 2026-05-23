import { formatCurrency } from '../../utils/format';
import WalletCard from './WalletCard';

/**
 * Danh sách ví
 */
const WalletList = ({ wallets, selectedWalletId, onEdit, onDelete, onSelect, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        ⏳ Đang tải...
      </div>
    );
  }

  if (!wallets || wallets.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderLeft: '4px solid #9ca3af',
        }}
      >
        <p style={{ margin: 0, color: '#666' }}>
          📭 Chưa có ví nào<br />
          <span style={{ fontSize: '12px' }}>Nhấn "➕ Tạo ví mới" để bắt đầu</span>
        </p>
      </div>
    );
  }

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  return (
    <div>
      {/* Tổng số dư */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Tổng số dư tất cả ví</p>
        <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* Danh sách ví */}
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet._id}
          wallet={wallet}
          isSelected={selectedWalletId === wallet._id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WalletList;

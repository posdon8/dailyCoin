import { formatCurrency } from '../../utils/format';

/**
 * Thẻ ví/tài khoản
 */
const WalletCard = ({ wallet, onEdit, onDelete, onSelect, isSelected }) => {
  return (
    <div
      className="card"
      onClick={() => onSelect && onSelect(wallet._id)}
      style={{
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        border: isSelected ? '3px solid #667eea' : '1px solid #e5e7eb',
        backgroundColor: isSelected ? '#f0f4ff' : 'white',
        transition: 'all 0.2s ease',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '32px' }}>{wallet.icon}</span>
          <div>
            <h4 style={{ margin: 0, fontWeight: 'bold' }}>{wallet.name}</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              {wallet.type === 'cash' && '💵 Tiền mặt'}
              {wallet.type === 'bank' && '🏦 Tài khoản ngân hàng'}
              {wallet.type === 'digital' && '📱 Ví điện tử'}
              {wallet.type === 'credit_card' && '💳 Thẻ tín dụng'}
              {wallet.type === 'other' && '🎁 Khác'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-small btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(wallet);
            }}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            ✏️
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Bạn chắc chắn muốn xóa ví này?')) {
                onDelete(wallet._id);
              }
            }}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            🗑️
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: wallet.color + '20',
          borderLeft: `4px solid ${wallet.color}`,
          padding: '8px 12px',
          borderRadius: '4px',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: wallet.color }}>
          {formatCurrency(wallet.balance)}
        </p>
      </div>

      {wallet.description && (
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
          {wallet.description}
        </p>
      )}
    </div>
  );
};

export default WalletCard;

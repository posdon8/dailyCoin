import { useState, useEffect } from 'react';
import WalletForm from '../components/wallet/WalletForm';
import WalletList from '../components/wallet/WalletList';
import { useWallets } from '../hooks/useWallets';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency } from '../utils/format';

const WalletPage = () => {
  const [editingId, setEditingId] = useState(null);
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  
  const { 
    wallets, 
    summary, 
    loading, 
    error,
    loadWallets,
    createWallet,
    updateWallet,
    deleteWallet,
    loadWalletsSummary
  } = useWallets();
  
  const { showNotification } = useNotification();

  // Load wallets khi mount
  useEffect(() => {
    loadWallets();
    loadWalletsSummary();
  }, []);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      showNotification(`❌ Lỗi: ${error}`, 'danger');
    }
  }, [error, showNotification]);

  const handleAddWallet = async (formData) => {
    try {
      await createWallet(formData);
      showNotification('✅ Tạo ví mới thành công', 'success');
      await loadWallets();
      await loadWalletsSummary();
    } catch (err) {
      showNotification(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  const handleUpdateWallet = async (walletId, formData) => {
    try {
      await updateWallet(walletId, formData);
      showNotification('✅ Cập nhật ví thành công', 'success');
      setEditingId(null);
      await loadWallets();
      await loadWalletsSummary();
    } catch (err) {
      showNotification(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (confirm('Bạn chắc chắn muốn xóa ví này?')) {
      try {
        await deleteWallet(walletId);
        showNotification('✅ Xóa ví thành công', 'success');
        setSelectedWalletId(null);
        await loadWallets();
        await loadWalletsSummary();
      } catch (err) {
        showNotification(`❌ Lỗi: ${err.message}`, 'danger');
      }
    }
  };

  const handleEditClick = (wallet) => {
    setEditingId(wallet._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSelectWallet = (walletId) => {
    setSelectedWalletId(selectedWalletId === walletId ? null : walletId);
  };

  const editingWallet = editingId ? wallets.find((w) => w._id === editingId) : null;

  return (
    <div className="container p-3">
      {/* Tóm tắt tổng số dư */}
      {summary && (
        <div className="card mb-4">
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
            💰 Tổng số dư: {formatCurrency(summary.totalBalance)}
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {wallets.length} ví | Tổng tiền: {formatCurrency(summary.totalBalance)}
          </p>
        </div>
      )}

      {/* Form tạo/sửa ví */}
      <div className="card mb-4">
        <h3>
          {editingId ? '✏️ Chỉnh sửa ví' : '➕ Tạo ví mới'}
        </h3>
        <WalletForm
          initialWallet={editingWallet}
          onSubmit={editingId ? 
            (data) => handleUpdateWallet(editingId, data) 
            : handleAddWallet
          }
          onCancel={editingId ? handleCancelEdit : null}
        />
      </div>

      {/* Danh sách ví */}
      <div className="card">
        <h3>💳 Danh sách ví</h3>
        <WalletList
          wallets={wallets}
          selectedWalletId={selectedWalletId}
          onEdit={handleEditClick}
          onDelete={handleDeleteWallet}
          onSelect={handleSelectWallet}
          loading={loading}
        />
      </div>

      {/* Stats */}
      {wallets.length > 0 && (
        <div className="card mt-4">
          <h3>📊 Thống kê</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                Số ví
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                {wallets.length}
              </p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#f3e5f5', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                Tổng dư
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
                {formatCurrency(summary?.totalBalance || 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;

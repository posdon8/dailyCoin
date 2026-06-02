import React, { useState, useEffect } from 'react';
import { useDebts } from '../hooks/useDebts';
import DebtStats from '../components/debt/DebtStats';
import DebtList from '../components/debt/DebtList';
import DebtForm from '../components/debt/DebtForm';
import PaymentModal from '../components/debt/PaymentModal';
import DebtDetailsModal from '../components/debt/DebtDetailsModal';
import Notification from '../components/common/Notification';
import Loading from '../components/common/Loading';
import '../components/styles/DebtPage.css';

const DebtPage = () => {
  const {
    debts,
    loading,
    error,
    stats,
    fetchDebts,
    fetchStats,
    createDebt,
    updateDebt,
    deleteDebt,
    recordPayment,
    searchDebts,
  } = useDebts();

  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [notification, setNotification] = useState(null);

  // Tải dữ liệu lần đầu
  useEffect(() => {
    fetchDebts();
    fetchStats();
  }, []);

  // Xử lý khi tìm kiếm thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchDebts(searchQuery, {
          status: filterStatus !== 'all' ? filterStatus : '',
          priority: filterPriority !== 'all' ? filterPriority : '',
        });
      } else {
        fetchDebts({
          status: filterStatus !== 'all' ? filterStatus : '',
          priority: filterPriority !== 'all' ? filterPriority : '',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus, filterPriority]);

  const handleCreateDebt = async (formData) => {
    const newDebt = await createDebt(formData);
    if (newDebt) {
      setNotification({
        type: 'success',
        message: 'Thêm khoản nợ thành công',
      });
      setShowForm(false);
      fetchStats();
    }
  };

  const handleUpdateDebt = async (formData) => {
    const updated = await updateDebt(editingDebt._id, formData);
    if (updated) {
      setNotification({
        type: 'success',
        message: 'Cập nhật khoản nợ thành công',
      });
      setShowForm(false);
      setEditingDebt(null);
      fetchStats();
    }
  };

  const handleDeleteDebt = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khoản nợ này?')) {
      const success = await deleteDebt(id);
      if (success) {
        setNotification({
          type: 'success',
          message: 'Xóa khoản nợ thành công',
        });
        fetchStats();
      }
    }
  };

  const handlePayment = async (amount, sendNotification = false) => {
    const updated = await recordPayment(selectedDebt._id, amount, sendNotification);
    if (updated) {
      setNotification({
        type: 'success',
        message: `Ghi nhận thanh toán ${amount.toLocaleString('vi-VN')} VND thành công`,
      });
      setShowPaymentModal(false);
      fetchStats();
    }
  };

  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setShowForm(true);
  };

  const handlePaymentClick = (debt) => {
    setSelectedDebt(debt);
    setShowPaymentModal(true);
  };

  const handleViewDetails = (debt) => {
    setSelectedDebt(debt);
    setShowDetailsModal(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDebt(null);
  };

  if (loading && debts.length === 0) {
    return <Loading />;
  }

  return (
    <div className="debt-page">
      <div className="page-header">
        <h1>Quản lý nợ</h1>
        <p className="subtitle">Theo dõi những khoản nợ và trực quan hóa người nợ tiền</p>
      </div>

      {error && (
        <Notification
          type="error"
          message={error}
          onClose={() => setNotification(null)}
        />
      )}

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {stats && <DebtStats stats={stats} />}

      <div className="debt-content">
        <div className="debt-sidebar">
          {!showForm ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowForm(true)}
            >
              + Thêm nợ mới
            </button>
          ) : (
            <DebtForm
              onSubmit={editingDebt ? handleUpdateDebt : handleCreateDebt}
              initialData={editingDebt}
              onCancel={handleFormCancel}
            />
          )}
        </div>

        <div className="debt-main">
          <div className="debt-filters">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên người nợ hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="filter-group">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chưa thanh toán</option>
                <option value="partial">Thanh toán một phần</option>
                <option value="settled">Đã thanh toán</option>
              </select>

              <select
                className="filter-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Tất cả ưu tiên</option>
                <option value="low">Ưu tiên thấp</option>
                <option value="medium">Ưu tiên trung bình</option>
                <option value="high">Ưu tiên cao</option>
              </select>
            </div>
          </div>

          <DebtList
            debts={debts}
            onEdit={handleEditDebt}
            onDelete={handleDeleteDebt}
            onPayment={handlePaymentClick}
            onViewDetails={handleViewDetails}
            filter={filterStatus}
            loading={loading}
          />
        </div>
      </div>

      {showPaymentModal && selectedDebt && (
        <PaymentModal
          debt={selectedDebt}
          onConfirm={handlePayment}
          onCancel={() => {
            setShowPaymentModal(false);
            setSelectedDebt(null);
          }}
        />
      )}

      {showDetailsModal && selectedDebt && (
        <DebtDetailsModal
          debt={selectedDebt}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedDebt(null);
          }}
        />
      )}
    </div>
  );
};

export default DebtPage;

import { useState, useEffect } from 'react';
import ImageUpload from '../components/attachment/ImageUpload';
import ImageGallery from '../components/attachment/ImageGallery';
import { useAttachments } from '../hooks/useAttachments';
import { useNotification } from '../context/NotificationContext';

const AttachmentPage = ({ expenses = [] }) => {
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  
  const { 
    attachments, 
    loading, 
    error,
    loadAttachments,
    uploadAttachment,
    deleteAttachment,
    updateAttachment
  } = useAttachments();
  
  const { showNotification } = useNotification();

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      showNotification(`❌ Lỗi: ${error}`, 'danger');
    }
  }, [error, showNotification]);

  const handleSelectExpense = (expenseId) => {
  setSelectedExpenseId(expenseId);
  loadAttachments(expenseId);
};
  const handleUploadAttachment = async (expenseId, file, description) => {
    if (!selectedExpenseId) {
      showNotification('⚠️ Vui lòng chọn chi tiêu trước', 'warning');
      return;
    }

    try {
      await uploadAttachment(expenseId, file, description);
      showNotification('✅ Tải ảnh thành công', 'success');
      await loadAttachments(expenseId);
    } catch (err) {
      showNotification(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (confirm('Bạn chắc chắn muốn xóa ảnh này?')) {
      try {
        await deleteAttachment(selectedExpenseId, attachmentId);
        showNotification('✅ Xóa ảnh thành công', 'success');
        if (selectedExpenseId) {
          await loadAttachments(selectedExpenseId);
        }
      } catch (err) {
        showNotification(`❌ Lỗi: ${err.message}`, 'danger');
      }
    }
  };

  const handleUpdateAttachment = async (attachmentId, description) => {
    try {
      await updateAttachment(selectedExpenseId, attachmentId, description);
      showNotification('✅ Cập nhật ảnh thành công', 'success');
      if (selectedExpenseId) {
        await loadAttachments(selectedExpenseId);
      }
    } catch (err) {
      showNotification(`❌ Lỗi: ${err.message}`, 'danger');
    }
  };

  // Lọc chi tiêu theo danh mục nếu có
  let filteredExpenses = expenses;
  if (filterCategory) {
    filteredExpenses = expenses.filter(exp => exp.category === filterCategory);
  }

  // Danh sách danh mục không trùng lặp
  const categories = [...new Set(expenses.map(exp => exp.category))].filter(Boolean);

  const selectedExpense = expenses.find(exp => exp.id === selectedExpenseId);
  const currentAttachments = selectedExpenseId ? (attachments[selectedExpenseId] || []) : [];

  return (
    <div className="container p-3">
      <h1>📸 Quản lý ảnh đính kèm</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Panel chọn chi tiêu */}
        <div>
          <div className="card">
            <h3>📝 Chọn chi tiêu</h3>

            {/* Filter danh mục */}
            <div className="mb-3">
              <label htmlFor="category-filter" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                Danh mục:
              </label>
              <select
                id="category-filter"
                value={filterCategory || ''}
                onChange={(e) => {
                  setFilterCategory(e.target.value || null);
                  setSelectedExpenseId(null);
                }}
                className="form-control"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Danh sách chi tiêu */}
            <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
              {filteredExpenses.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  📭 Không có chi tiêu nào
                </div>
              ) : (
                filteredExpenses.map(expense => (
                  <div
                    key={expense.id}
                    onClick={() => handleSelectExpense(expense.id)}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: selectedExpenseId === expense.id ? '#e3f2fd' : 'white',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>
                      {expense.description}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {expense.category} • {new Date(expense.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel tải ảnh và xem ảnh */}
        <div>
          {selectedExpense ? (
            <>
              {/* Thông tin chi tiêu đã chọn */}
              <div className="card mb-4">
                <h3>✅ Chi tiêu được chọn</h3>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  <strong>{selectedExpense.description}</strong>
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                  {selectedExpense.category} • {selectedExpense.amount.toLocaleString('vi-VN')} VND
                </p>
              </div>

              {/* Form tải ảnh */}
              <div className="card mb-4">
                <h3>📤 Tải ảnh lên</h3>
                <ImageUpload
                  expenseId={selectedExpenseId} 
                  onUpload={handleUploadAttachment}
                  loading={loading}
                />
              </div>

              {/* Hiển thị ảnh */}
              <div className="card">
                <h3>
                  🖼️ Ảnh đính kèm ({currentAttachments.length})
                </h3>
                <ImageGallery
                  attachments={currentAttachments}
                  onDelete={handleDeleteAttachment}
                  onUpdate={handleUpdateAttachment}
                  loading={loading}
                />
              </div>
            </>
          ) : (
            <div className="card">
              <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                border: '2px dashed #ccc'
              }}>
                <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
                  👈 Vui lòng chọn chi tiêu từ bên trái
                </p>
                <p style={{ margin: '10px 0 0 0', color: '#999', fontSize: '14px' }}>
                  để xem và tải ảnh đính kèm
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {expenses.length > 0 && (
        <div className="card mt-4">
          <h3>📊 Thống kê ảnh</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e8f5e9', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                Tổng chi tiêu
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
                {expenses.length}
              </p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#fff3e0', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                Chi tiêu có ảnh
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                {Object.keys(attachments).filter(key => attachments[key]?.length > 0).length}
              </p>
            </div>

            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                Tổng ảnh
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                {Object.values(attachments).flat().length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentPage;

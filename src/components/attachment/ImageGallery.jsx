import { useState } from 'react';
import { formatDate } from '../../utils/format';

/**
 * Hiển thị bộ sưu tập ảnh
 */
const ImageGallery = ({ attachments, onDelete, onUpdate, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  if (!attachments || attachments.length === 0) {
    return (
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
          📭 Chưa có ảnh nào
        </p>
      </div>
    );
  }

  const handleStartEdit = (attachment) => {
    setEditingId(attachment._id);
    setEditDescription(attachment.description);
  };

  const handleSaveEdit = async (attachmentId) => {
    try {
      await onUpdate(attachmentId, editDescription);
      setEditingId(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <h4 style={{ margin: '0 0 12px 0' }}>🖼️ Ảnh hóa đơn ({attachments.length})</h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        {attachments.map((attachment) => (
          <div
            key={attachment._id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            {/* Ảnh */}
            <div
              style={{
                width: '100%',
                paddingBottom: '100%',
                position: 'relative',
                backgroundColor: '#f3f4f6',
                overflow: 'hidden',
              }}
            >
              <img
                src={attachment.fileData}
                alt={attachment.fileName}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Info */}
            <div style={{ padding: '8px' }}>
              {editingId === attachment._id ? (
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Mô tả..."
                    maxLength="200"
                    style={{ width: '100%', padding: '4px', fontSize: '12px', marginBottom: '4px' }}
                  />
                  <div className="flex gap-2" style={{ fontSize: '12px' }}>
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => handleSaveEdit(attachment._id)}
                      disabled={loading}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ✅
                    </button>
                    <button
                      className="btn btn-small"
                      onClick={() => setEditingId(null)}
                      disabled={loading}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#999' }}>
                    {attachment.fileName}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>
                    {attachment.description || '(Không có mô tả)'}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#999' }}>
                    {formatDate(new Date(attachment.uploadedAt))}
                  </p>

                  <div className="flex gap-1" style={{ fontSize: '12px' }}>
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => handleStartEdit(attachment)}
                      disabled={loading}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => {
                        if (confirm('Xóa ảnh này?')) {
                          onDelete(attachment._id);
                        }
                      }}
                      disabled={loading}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

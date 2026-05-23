import { useState } from 'react';

/**
 * Component tải ảnh lên
 */
const ImageUpload = ({ expenseId, onUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra kích thước (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File quá lớn! Tối đa 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn ảnh');
      return;
    }

    setUploading(true);
    try {
      await onUpload(expenseId, selectedFile, description);
      setSelectedFile(null);
      setDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '16px', marginBottom: '16px', backgroundColor: '#f9fafb' }}>
      <h4 style={{ margin: '0 0 12px 0' }}>📸 Tải ảnh hóa đơn</h4>

      <div className="form-group">
        <label htmlFor="file-input">Chọn ảnh *</label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || loading}
          style={{ cursor: 'pointer' }}
        />
        {selectedFile && (
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>
            ✅ {selectedFile.name}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Mô tả (tùy chọn)</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ví dụ: Hóa đơn ăn trưa tại XYZ"
          maxLength="200"
          disabled={uploading || loading}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={!selectedFile || uploading || loading}
        style={{ width: '100%' }}
      >
        {uploading ? '⏳ Đang tải...' : '📤 Tải lên'}
      </button>
    </div>
  );
};

export default ImageUpload;

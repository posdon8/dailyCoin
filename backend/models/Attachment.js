import mongoose from 'mongoose';

/**
 * Schema cho hình ảnh/đính kèm
 */
const attachmentSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      default: 'default-user',
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'Vui lòng cung cấp tên file'],
    },
    mimeType: {
      type: String,
      default: 'image/jpeg',
      enum: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
    },
    fileSize: {
      type: Number,
      required: true,
      max: [10485760, 'File không được vượt quá 10MB'], // 10MB
    },
    // Lưu trữ ảnh dạng base64 hoặc URL từ cloud storage
    // Nếu sử dụng MongoDB, khuyên dùng base64 hoặc liên kết AWS S3/Cloudinary
    fileData: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Index cho tìm kiếm nhanh
attachmentSchema.index({ expenseId: 1 });
attachmentSchema.index({ userId: 1 });

const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;

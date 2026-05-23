import mongoose from 'mongoose';

/**
 * Schema cho ngân sách theo danh mục
 */
const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default-user',
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['food', 'transport', 'shopping', 'entertainment', 'other'],
    },
    limit: {
      type: Number,
      required: [true, 'Vui lòng nhập ngân sách tối đa'],
      min: [0, 'Ngân sách không được âm'],
    },
    month: {
      type: Number,
      required: [true, 'Vui lòng chọn tháng'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Vui lòng chọn năm'],
      min: 2000,
      max: 2100,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Ghi chú không được vượt quá 500 ký tự'],
    },
    alert_threshold: {
      type: Number,
      default: 80, // Cảnh báo khi đạt 80%
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Index unique cho từng danh mục/tháng/năm của người dùng
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;

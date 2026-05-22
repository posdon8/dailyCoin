import mongoose from 'mongoose';

/**
 * Budget Schema - Quản lý ngân sách theo danh mục
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
      enum: ['food', 'transport', 'shopping', 'entertainment', 'other'],
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

// Index cho tìm kiếm nhanh
budgetSchema.index({ userId: 1, month: 1, year: 1 });
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;

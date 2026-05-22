import mongoose from 'mongoose';

/**
 * Schema cho chi tiêu
 */
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default-user', // Tạm thời, sau có thể thêm authentication
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền'],
      min: [0, 'Số tiền phải lớn hơn 0'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['food', 'transport', 'shopping', 'entertainment', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả'],
      maxlength: [200, 'Mô tả không được vượt quá 200 ký tự'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày'],
      default: new Date().toISOString().split('T')[0],
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Ghi chú không được vượt quá 500 ký tự'],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
    toJSON: { virtuals: true },
  }
);

// Index cho tìm kiếm nhanh
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

// Virtual: ngày định dạng YYYY-MM-DD
expenseSchema.virtual('dateString').get(function () {
  return this.date.toISOString().split('T')[0];
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

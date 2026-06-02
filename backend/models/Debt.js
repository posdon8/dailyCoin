import mongoose from 'mongoose';

/**
 * Schema cho nợ
 */
const debtSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Người cho vay (chủ nợ)
    },
    debtorName: {
      type: String,
      required: [true, 'Vui lòng nhập tên người nợ'],
      trim: true,
    },
    debtorEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    bankName: {
      type: String,
      default: '',
      trim: true,
    },
    bankAccount: {
      type: String,
      default: '',
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền'],
      min: [0, 'Số tiền phải lớn hơn 0'],
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả khoản nợ'],
      maxlength: [200, 'Mô tả không được vượt quá 200 ký tự'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['personal', 'business', 'loan', 'other'],
      default: 'personal',
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'settled'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Vui lòng chọn ngày đến hạn'],
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, 'Số tiền thanh toán phải lớn hơn 0'],
    },
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Ghi chú không được vượt quá 500 ký tự'],
    },
    relatedExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh
debtSchema.index({ userId: 1, status: 1 });
debtSchema.index({ dueDate: 1 });
debtSchema.index({ debtorName: 1 });

// Virtual cho số tiền còn nợ
debtSchema.virtual('remainingAmount').get(function () {
  return Math.max(0, this.amount - this.amountPaid);
});

// Virtual cho trạng thái vượt hạn
debtSchema.virtual('isOverdue').get(function () {
  return this.status !== 'settled' && new Date(this.dueDate) < new Date();
});

const Debt = mongoose.model('Debt', debtSchema);

export default Debt;

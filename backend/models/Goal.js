import mongoose from 'mongoose';

/**
 * Schema cho mục tiêu tiết kiệm
 */
const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default-user',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên mục tiêu'],
      trim: true,
      maxlength: [100, 'Tên mục tiêu không được vượt quá 100 ký tự'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Vui lòng nhập số tiền mục tiêu'],
      min: [0, 'Số tiền phải lớn hơn 0'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Số tiền hiện tại không được âm'],
    },
    category: {
      type: String,
      required: [true, 'Vui lòng chọn danh mục'],
      enum: ['vacation', 'education', 'car', 'home', 'emergency', 'investment', 'other'],
      default: 'other',
    },
    deadline: {
      type: Date,
      required: [true, 'Vui lòng chọn thời hạn'],
    },
    icon: {
      type: String,
      default: '💰', // emoji icon
    },
    color: {
      type: String,
      default: '#3b82f6', // hex color
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1: high, 2: medium, 3: low
      default: 2,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Ghi chú không được vượt quá 1000 ký tự'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual: phần trăm hoàn thành
goalSchema.virtual('progressPercentage').get(function () {
  if (this.targetAmount === 0) return 0;
  return Math.min(100, Math.round((this.currentAmount / this.targetAmount) * 100));
});

// Virtual: số tiền còn thiếu
goalSchema.virtual('remainingAmount').get(function () {
  return Math.max(0, this.targetAmount - this.currentAmount);
});

// Virtual: ngày còn lại
goalSchema.virtual('daysRemaining').get(function () {
  const today = new Date();
  const deadline = new Date(this.deadline);
  const timeDifference = deadline - today;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return Math.max(0, daysRemaining);
});

// Index
goalSchema.index({ userId: 1, deadline: 1 });
goalSchema.index({ userId: 1, isCompleted: 1 });
goalSchema.index({ userId: 1, category: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

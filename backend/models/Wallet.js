import mongoose from 'mongoose';

/**
 * Wallet Schema - Quản lý ví/tài khoản
 */
const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'default-user',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['cash', 'bank', 'ewallet', 'other'],
      required: true,
    },
    initialBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    color: {
      type: String,
      default: '#667eea',
    },
    icon: {
      type: String,
      default: '💰',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

// Index cho tìm kiếm nhanh
walletSchema.index({ userId: 1, isActive: 1 });
walletSchema.index({ userId: 1, type: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;

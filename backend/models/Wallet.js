import mongoose from 'mongoose';

/**
 * Schema cho ví/tài khoản
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
      required: [true, 'Vui lòng nhập tên ví'],
      maxlength: [100, 'Tên ví không được vượt quá 100 ký tự'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Vui lòng chọn loại ví'],
      enum: ['cash', 'bank', 'digital', 'credit_card', 'other'],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Số dư không được âm'],
    },
    currency: {
      type: String,
      default: 'VND',
      enum: ['VND', 'USD', 'EUR', 'JPY'],
    },
    color: {
      type: String,
      default: '#667eea', // Màu hex cho hiển thị UI
    },
    icon: {
      type: String,
      default: '💰', // Icon emoji
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Index cho tìm kiếm nhanh
walletSchema.index({ userId: 1, isActive: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;

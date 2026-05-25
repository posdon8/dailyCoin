import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Email không hợp lệ'],
    },
    googleId: { type: String, default: '' },
    avatar: { type: String, default: '' },
    password: {
      type: String,
      default: '',
      // Allow empty password for OAuth users; if provided, enforce minimum length
      validate: {
        validator: function (v) {
          return !v || v.length >= 6;
        },
        message: 'Mật khẩu phải có tối thiểu 6 ký tự',
      },
      select: false,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;

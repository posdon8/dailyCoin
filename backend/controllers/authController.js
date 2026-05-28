import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'daily-expenses-secret';
const JWT_EXPIRES_IN = '30d';

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase().trim(), password: hashedPassword, name: name || '' });
    const token = signToken(user);

    res.status(201).json({ success: true, data: { user: { id: user._id, email: user.email, name: user.name }, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email và mật khẩu là bắt buộc' });
    }

    // Password field is not selected by default for security; request it here
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tài khoản Google không có password
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Tài khoản này đăng nhập bằng Google. Vui lòng dùng nút Đăng nhập với Google.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = signToken(user);
    res.status(200).json({ success: true, data: { user: { id: user._id, email: user.email, name: user.name }, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ 
      success: true, 
      data: { 
        id: user._id, 
        email: user.email,
        name: user.name,
        avatar: user.avatar || '',
        googleId: user.googleId || '',
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Google OAuth callback handler
// Được gọi sau khi passport xác thực xong
// ================================
export const googleCallback = (req, res) => {
  try {
    const user = req.user;
    console.log('[GoogleCallback] req.user:', user);
    
    if (!user) {
      console.error('[GoogleCallback] No user found in request');
      return res.redirect(`${process.env.FRONTEND_URL}?error=google_auth_failed`);
    }

    const token = signToken(user);
    console.log('[GoogleCallback] Token generated:', token ? 'success' : 'failed');
    console.log('[GoogleCallback] Redirecting to:', `${process.env.FRONTEND_URL}?token=${token}`);
    
    // Redirect to frontend with token in URL
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    console.error('[GoogleCallback] Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=google_auth_failed`);
  }
};

// ================================
// Logout handler
// ================================
export const logout = (req, res) => {
  try {
    // Since we're using stateless JWT, logout is mostly client-side
    // Server-side: invalidate token if needed (optional)
    console.log('[Logout] User logged out:', req.user?.email);
    res.status(200).json({ 
      success: true, 
      message: 'Đã đăng xuất thành công' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
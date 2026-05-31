import Wallet from '../models/Wallet.js';
import Expense from '../models/Expense.js';

/**
 * GET /api/wallets
 * Lấy tất cả ví của người dùng
 */
export const getWallets = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wallets = await Wallet.find({ userId }).sort({ createdAt: 1 });
    res.json({
      success: true,
      count: wallets.length,
      data: wallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * GET /api/wallets/:id
 * Lấy chi tiết ví
 */
export const getWalletById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wallet = await Wallet.findOne({ _id: req.params.id, userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ví',
      });
    }
    res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * POST /api/wallets
 * Tạo ví mới
 */
export const createWallet = async (req, res) => {
  try {
    const { name, type, balance, currency, color, icon, description } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
    }

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (name, type)',
      });
    }

    const wallet = new Wallet({
      userId,
      name,
      type,
      balance: balance || 0,
      currency: currency || 'VND',
      color: color || '#667eea',
      icon: icon || '💰',
      description: description || '',
    });

    await wallet.save();
    res.status(201).json({
      success: true,
      message: 'Tạo ví thành công',
      data: wallet,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * PUT /api/wallets/:id
 * Cập nhật ví
 */
export const updateWallet = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, type, balance, currency, color, icon, description, isActive } = req.body;

    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        name,
        type,
        balance,
        currency,
        color,
        icon,
        description,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ví',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật ví thành công',
      data: wallet,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/wallets/:id
 * Xóa ví
 */
export const deleteWallet = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Không xác thực được người dùng' });
    }

    const wallet = await Wallet.findOneAndDelete({ _id: req.params.id, userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ví hoặc bạn không có quyền',
      });
    }

    // Xóa tham chiếu ví từ các chi tiêu
    await Expense.updateMany(
      { walletId: req.params.id },
      { walletId: '' }
    );

    res.json({
      success: true,
      message: 'Xóa ví thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * GET /api/wallets/:id/balance
 * Lấy số dư ví + thống kê chi tiêu
 */
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wallet = await Wallet.findOne({ _id: req.params.id, userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ví',
      });
    }

    // Tính tổng chi tiêu từ ví này
    const expenses = await Expense.find({ walletId: req.params.id });
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const expenseCount = expenses.length;

    res.json({
      success: true,
      data: {
        wallet,
        totalSpent,
        expenseCount,
        currentBalance: wallet.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * PUT /api/wallets/:id/balance
 * Cập nhật số dư ví
 */
export const updateWalletBalance = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { balance, operation, amount } = req.body;

    let newBalance = balance;
    if (operation === 'add') {
      newBalance = balance + amount;
    } else if (operation === 'subtract') {
      newBalance = balance - amount;
    }

    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số dư không được âm',
      });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, userId },
      { balance: newBalance },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật số dư thành công',
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * GET /api/wallets/summary/total
 * Tổng hợp tất cả ví
 */
export const getWalletsSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    const wallets = await Wallet.find({ userId, isActive: true });

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const byType = {};

    wallets.forEach((wallet) => {
      if (!byType[wallet.type]) {
        byType[wallet.type] = { count: 0, totalBalance: 0, wallets: [] };
      }
      byType[wallet.type].count += 1;
      byType[wallet.type].totalBalance += wallet.balance;
      byType[wallet.type].wallets.push(wallet);
    });

    res.json({
      success: true,
      data: {
        totalBalance,
        walletCount: wallets.length,
        byType,
        wallets,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

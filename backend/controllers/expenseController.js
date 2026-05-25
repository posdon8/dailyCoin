import Expense from '../models/Expense.js';
import Wallet from '../models/Wallet.js';

/**
 * Lấy tất cả chi tiêu của user
 * GET /api/expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy chi tiêu theo ID
 * GET /api/expenses/:id
 */
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Chi tiêu không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tạo chi tiêu mới
 * POST /api/expenses
 */
export const createExpense = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount, category, description, date, walletId, tags, notes } = req.body;

    // Validate dữ liệu
    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: amount, category, description, date',
      });
    }

    const walletOwnerId = userId;
    if (walletId) {
      const wallet = await Wallet.findOne({ _id: walletId, userId: walletOwnerId });
      if (!wallet) {
        return res.status(400).json({ success: false, message: 'Ví không tồn tại hoặc không thuộc người dùng' });
      }
    }

    const expense = await Expense.create({
      userId,
      amount,
      category,
      description,
      walletId: walletId || '',
      date: new Date(date),
      tags: tags || [],
      notes: notes || '',
    });

    if (walletId) {
      await Wallet.findByIdAndUpdate(walletId, {
        $inc: { balance: -amount },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Chi tiêu được tạo thành công',
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cập nhật chi tiêu
 * PUT /api/expenses/:id
 */
export const updateExpense = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { amount, category, description, date, walletId, tags, notes } = req.body;

    const existingExpense = await Expense.findById(req.params.id);
    if (!existingExpense || existingExpense.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Chi tiêu không tìm thấy',
      });
    }

    const oldWalletId = existingExpense.walletId || '';
    const oldAmount = existingExpense.amount || 0;
    const newWalletId = walletId === undefined || walletId === null ? oldWalletId : walletId || '';
    const newAmount = amount !== undefined ? amount : oldAmount;

    if (newWalletId && newWalletId !== oldWalletId) {
      const wallet = await Wallet.findOne({ _id: newWalletId, userId });
      if (!wallet) {
        return res.status(400).json({ success: false, message: 'Ví mới không tồn tại hoặc không thuộc người dùng' });
      }
    }

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        category,
        description,
        date: date ? new Date(date) : existingExpense.date,
        walletId: newWalletId,
        tags,
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (oldWalletId && oldWalletId !== newWalletId) {
      await Wallet.findByIdAndUpdate(oldWalletId, {
        $inc: { balance: oldAmount },
      });
    }

    if (newWalletId && oldWalletId !== newWalletId) {
      await Wallet.findByIdAndUpdate(newWalletId, {
        $inc: { balance: -newAmount },
      });
    }

    if (newWalletId && oldWalletId === newWalletId && oldAmount !== newAmount) {
      await Wallet.findByIdAndUpdate(newWalletId, {
        $inc: { balance: oldAmount - newAmount },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiêu được cập nhật thành công',
      data: expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Xóa chi tiêu
 * DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user?.id;
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Chi tiêu không tìm thấy',
      });
    }

    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

    if (expense.walletId) {
      await Wallet.findByIdAndUpdate(expense.walletId, {
        $inc: { balance: expense.amount },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiêu được xóa thành công',
      data: deletedExpense || expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy chi tiêu theo khoảng ngày
 * GET /api/expenses/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getExpensesByDateRange = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp startDate và endDate',
      });
    }

    const expenses = await Expense.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy chi tiêu theo tháng
 * GET /api/expenses/month?month=5&year=2026
 */
export const getExpensesByMonth = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp month và year',
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy thống kê chi tiêu
 * GET /api/expenses/stats?month=5&year=2026
 */
export const getExpenseStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { month, year } = req.query;

    let dateFilter = { userId };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      dateFilter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Tổng chi tiêu
    const totalStats = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Chi tiêu theo danh mục
    const byCategory = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    // Chi tiêu theo ngày
    const byDate = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalStats[0] || { totalAmount: 0, count: 0 },
        byCategory,
        byDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Xóa tất cả chi tiêu (for testing)
 * DELETE /api/expenses
 */
export const deleteAllExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await Expense.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: 'Tất cả chi tiêu đã được xóa',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

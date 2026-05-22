import Expense from '../models/Expense.js';

/**
 * Lấy tất cả chi tiêu của user
 * GET /api/expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const { userId = 'default-user' } = req.query;
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
    const { userId = 'default-user', amount, category, description, date, tags, notes } = req.body;

    // Validate dữ liệu
    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin: amount, category, description, date',
      });
    }

    const expense = await Expense.create({
      userId,
      amount,
      category,
      description,
      date: new Date(date),
      tags: tags || [],
      notes: notes || '',
    });

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
    const { amount, category, description, date, tags, notes } = req.body;

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        category,
        description,
        date: date ? new Date(date) : undefined,
        tags,
        notes,
      },
      {
        new: true, // Trả về document đã được cập nhật
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Chi tiêu không tìm thấy',
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
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Chi tiêu không tìm thấy',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chi tiêu được xóa thành công',
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
 * Lấy chi tiêu theo khoảng ngày
 * GET /api/expenses/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
export const getExpensesByDateRange = async (req, res) => {
  try {
    const { userId = 'default-user', startDate, endDate } = req.query;

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
    const { userId = 'default-user', month, year } = req.query;

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
    const { userId = 'default-user', month, year } = req.query;

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
    const { userId = 'default-user' } = req.query;

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

import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

const DEFAULT_USER = 'default-user';

// ================================
// GET /api/budgets?month=5&year=2026
// Lấy tất cả budget của tháng
// ================================
export const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = DEFAULT_USER;

    if (!month || !year) {
      return res.status(400).json({ message: 'Thiếu tham số month hoặc year' });
    }

    const budgets = await Budget.find({
      userId,
      month: Number(month),
      year: Number(year),
    });

    // Tính tổng chi tiêu thực tế theo từng danh mục
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          $expr: {
            $and: [
              { $eq: [{ $month: '$date' }, Number(month)] },
              { $eq: [{ $year: '$date' }, Number(year)] },
            ],
          },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);
    console.log('month/year:', month, year);
    console.log('budgets found:', budgets.length);
    console.log('expenses aggregate:', JSON.stringify(expenses));
    // Map expense thực tế vào từng budget
    const spentMap = {};
    expenses.forEach((e) => {
      spentMap[e._id] = e.totalSpent;
    });

    const result = budgets.map((budget) => {
      const spent = spentMap[budget.category] || 0;
      const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.limit - spent,
        percentage,
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'safe',
      };
    });
    console.log('result sent to FE:', JSON.stringify(result));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ================================
// POST /api/budgets
// Tạo hoặc cập nhật budget (upsert)
// ================================
export const upsertBudget = async (req, res) => {
  try {
    const { category, limit, month, year, notes } = req.body;
    const userId = DEFAULT_USER;

    if (!category || limit === undefined || !month || !year) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    if (limit < 0) {
      return res.status(400).json({ message: 'Ngân sách không được âm' });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, category, month: Number(month), year: Number(year) },
      { limit: Number(limit), notes: notes || '' },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Lưu ngân sách thành công', data: budget });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ================================
// DELETE /api/budgets/:id
// Xóa budget theo ID
// ================================
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }

    res.json({ message: 'Xóa ngân sách thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ================================
// GET /api/budgets/summary?month=5&year=2026
// Tổng quan ngân sách + cảnh báo
// ================================
export const getBudgetSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = DEFAULT_USER;

    if (!month || !year) {
      return res.status(400).json({ message: 'Thiếu tham số month hoặc year' });
    }

    const budgets = await Budget.find({
      userId,
      month: Number(month),
      year: Number(year),
    });

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId,
          $expr: {
            $and: [
              { $eq: [{ $month: '$date' }, Number(month)] },
              { $eq: [{ $year: '$date' }, Number(year)] },
            ],
          },
        },
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
        },
      },
    ]);

    const spentMap = {};
    expenses.forEach((e) => {
      spentMap[e._id] = e.totalSpent;
    });

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.totalSpent, 0);

    const alerts = [];
    budgets.forEach((budget) => {
      const spent = spentMap[budget.category] || 0;
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      if (percentage >= 100) {
        alerts.push({
          category: budget.category,
          type: 'exceeded',
          message: `Đã vượt ngân sách danh mục "${budget.category}"`,
          spent,
          limit: budget.limit,
          percentage: Math.round(percentage),
        });
      } else if (percentage >= 80) {
        alerts.push({
          category: budget.category,
          type: 'warning',
          message: `Sắp đạt giới hạn ngân sách danh mục "${budget.category}" (${Math.round(percentage)}%)`,
          spent,
          limit: budget.limit,
          percentage: Math.round(percentage),
        });
      }
    });

    res.json({
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      overallPercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
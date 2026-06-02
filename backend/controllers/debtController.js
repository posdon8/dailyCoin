import Debt from '../models/Debt.js';
import { sendDebtNotificationEmail, sendPaymentConfirmationEmail, isEmailConfigured } from '../services/emailService.js';

/**
 * Lấy tất cả nợ của user
 * GET /api/debts
 */
export const getAllDebts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { status, priority } = req.query;

    let query = { userId };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const debts = await Debt.find(query)
      .populate('relatedExpense')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: debts.length,
      data: debts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy nợ theo ID
 * GET /api/debts/:id
 */
export const getDebtById = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id).populate('relatedExpense');

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Khoản nợ không tìm thấy',
      });
    }

    if (debt.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    res.status(200).json({
      success: true,
      data: debt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tạo nợ mới
 * POST /api/debts
 */
export const createDebt = async (req, res) => {
  try {
    const { debtorName, debtorEmail, bankName, bankAccount, amount, description, category, dueDate, priority, tags, notes, sendNotification } = req.body;
    const userId = req.user?.id;

    const debt = new Debt({
      userId,
      debtorName,
      debtorEmail,
      bankName,
      bankAccount,
      amount,
      description,
      category,
      dueDate,
      priority,
      tags,
      notes,
    });

    await debt.save();

    // Gửi email thông báo nếu được yêu cầu
    if (sendNotification && debtorEmail && isEmailConfigured()) {
      await sendDebtNotificationEmail(debt);
    }

    res.status(201).json({
      success: true,
      message: 'Tạo khoản nợ thành công',
      data: debt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cập nhật nợ
 * PUT /api/debts/:id
 */
export const updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Khoản nợ không tìm thấy',
      });
    }

    if (debt.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    const { sendNotification, ...updates } = req.body;

    // Cập nhật các trường cho phép
    Object.assign(debt, updates);

    // Tự động cập nhật trạng thái
    if (debt.amountPaid >= debt.amount) {
      debt.status = 'settled';
      debt.amountPaid = debt.amount;
    } else if (debt.amountPaid > 0) {
      debt.status = 'partial';
    }

    await debt.save();

    // Gửi email thông báo nếu được yêu cầu
    if (sendNotification && debt.debtorEmail && isEmailConfigured()) {
      await sendDebtNotificationEmail(debt);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật khoản nợ thành công',
      data: debt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Xóa nợ
 * DELETE /api/debts/:id
 */
export const deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Khoản nợ không tìm thấy',
      });
    }

    if (debt.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    await Debt.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa khoản nợ thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy thống kê nợ
 * GET /api/debts/stats/analytics
 */
export const getDebtStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    const stats = await Debt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          paid: { $sum: '$amountPaid' },
        },
      },
    ]);

    const totalDebt = await Debt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$amountPaid' },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
          overdueCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'settled'] },
                    { $lt: ['$dueDate', new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
      summary: totalDebt[0] || {
        totalAmount: 0,
        totalPaid: 0,
        pendingAmount: 0,
        overdueCount: 0,
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
 * Ghi nhận thanh toán nợ
 * POST /api/debts/:id/payment
 */
export const recordPayment = async (req, res) => {
  try {
    const { amountPaid, sendNotification } = req.body;
    const debt = await Debt.findById(req.params.id);

    if (!debt) {
      return res.status(404).json({
        success: false,
        message: 'Khoản nợ không tìm thấy',
      });
    }

    if (debt.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    const newAmountPaid = debt.amountPaid + amountPaid;

    if (newAmountPaid > debt.amount) {
      return res.status(400).json({
        success: false,
        message: `Số tiền thanh toán vượt quá số tiền nợ. Còn lại: ${debt.amount - debt.amountPaid}`,
      });
    }

    debt.amountPaid = newAmountPaid;

    if (debt.amountPaid >= debt.amount) {
      debt.status = 'settled';
      debt.amountPaid = debt.amount;
    } else if (debt.amountPaid > 0) {
      debt.status = 'partial';
    }

    await debt.save();

    // Gửi email xác nhận thanh toán
    if (sendNotification && debt.debtorEmail && isEmailConfigured()) {
      const remainingAmount = debt.amount - debt.amountPaid;
      await sendPaymentConfirmationEmail(debt, amountPaid, remainingAmount, debt.status);
    }

    res.status(200).json({
      success: true,
      message: 'Ghi nhận thanh toán thành công',
      data: debt,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Tìm kiếm nợ theo tên người nợ hoặc trạng thái
 * GET /api/debts/search
 */
export const searchDebts = async (req, res) => {
  try {
    const { query, status, priority } = req.query;
    const userId = req.user?.id;

    let filter = { userId };

    if (query) {
      filter.$or = [
        { debtorName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const debts = await Debt.find(filter)
      .populate('relatedExpense')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: debts.length,
      data: debts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

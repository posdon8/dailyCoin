import Attachment from '../models/Attachment.js';
import Expense from '../models/Expense.js';

/**
 * POST /api/attachments
 * Tạo attachment (tải ảnh lên)
 */
export const uploadAttachment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { expenseId, fileName, mimeType, fileSize, fileData, description } = req.body;

    if (!expenseId || !fileName || !fileData) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (expenseId, fileName, fileData)',
      });
    }

    // Kiểm tra expense tồn tại và thuộc người dùng
    const expense = await Expense.findById(expenseId);
    if (!expense || expense.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi tiêu hoặc bạn không có quyền',
      });
    }

    const attachment = new Attachment({
      expenseId,
      userId,
      fileName,
      mimeType: mimeType || 'image/jpeg',
      fileSize: fileSize || 0,
      fileData, // Base64 encoded
      description: description || '',
    });

    await attachment.save();

    // Thêm attachment vào expense
    if (!expense.attachments) {
      expense.attachments = [];
    }
    expense.attachments.push(attachment._id);
    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Tải ảnh thành công',
      data: attachment,
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
 * GET /api/attachments/expense/:expenseId
 * Lấy tất cả attachment của một chi tiêu
 */
export const getAttachmentsByExpense = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { expenseId } = req.params;

    const attachments = await Attachment.find({ expenseId, userId });

    res.json({
      success: true,
      count: attachments.length,
      data: attachments,
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
 * GET /api/attachments/:id
 * Lấy chi tiết attachment
 */
export const getAttachmentById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const attachment = await Attachment.findOne({ _id: req.params.id, userId });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đính kèm',
      });
    }

    res.json({
      success: true,
      data: attachment,
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
 * DELETE /api/attachments/:id
 * Xóa attachment
 */
export const deleteAttachment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const attachment = await Attachment.findOneAndDelete({ _id: req.params.id, userId });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đính kèm',
      });
    }

    // Xóa tham chiếu từ expense
    await Expense.findByIdAndUpdate(
      attachment.expenseId,
      { $pull: { attachments: attachment._id } }
    );

    res.json({
      success: true,
      message: 'Xóa đính kèm thành công',
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
 * GET /api/attachments
 * Lấy tất cả attachment của người dùng
 */
export const getAttachments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const attachments = await Attachment.find({ userId })
      .sort({ uploadedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: attachments.length,
      data: attachments,
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
 * POST /api/attachments/:id/update
 * Cập nhật thông tin attachment
 */
export const updateAttachment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { description } = req.body;

    const attachment = await Attachment.findOneAndUpdate(
      { _id: req.params.id, userId },
      { description },
      { new: true, runValidators: true }
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đính kèm',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: attachment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

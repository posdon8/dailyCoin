import express from 'express';
import {
  uploadAttachment,
  getAttachmentsByExpense,
  getAttachmentById,
  deleteAttachment,
  getAttachments,
  updateAttachment,
} from '../controllers/attachmentController.js';

const router = express.Router();

// GET    /api/attachments                  — Lấy tất cả attachment
// GET    /api/attachments/:id              — Lấy chi tiết attachment
// GET    /api/attachments/expense/:expenseId — Lấy attachment của expense
// POST   /api/attachments                  — Tạo attachment mới
// POST   /api/attachments/:id/update       — Cập nhật attachment
// DELETE /api/attachments/:id              — Xóa attachment

router.get('/', getAttachments);
router.post('/', uploadAttachment);
router.get('/:id', getAttachmentById);
router.get('/expense/:expenseId', getAttachmentsByExpense);
router.post('/:id/update', updateAttachment);
router.delete('/:id', deleteAttachment);

export default router;

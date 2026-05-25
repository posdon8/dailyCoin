import express from 'express';
import {
    getBudgets,
    upsertBudget,
    deleteBudget,
    getBudgetSummary,
} from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

// GET    /api/budgets?month=5&year=2026        — Lấy budgets + chi tiêu thực tế
// POST   /api/budgets                          — Tạo hoặc cập nhật budget
// DELETE /api/budgets/:id                      — Xóa budget
// GET    /api/budgets/summary?month=5&year=2026 — Tổng quan + cảnh báo

router.get('/summary', getBudgetSummary);
router.get('/', getBudgets);
router.post('/', upsertBudget);
router.delete('/:id', deleteBudget);

export default router;
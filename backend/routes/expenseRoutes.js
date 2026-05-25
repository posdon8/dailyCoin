import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesByDateRange,
  getExpensesByMonth,
  getExpenseStats,
  deleteAllExpenses,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

// CRUD Routes
router.get('/', getAllExpenses);
router.get('/range/search', getExpensesByDateRange);
router.get('/month/search', getExpensesByMonth);
router.get('/stats/analytics', getExpenseStats);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// Cleanup (Testing only)
router.delete('/', deleteAllExpenses);

export default router;

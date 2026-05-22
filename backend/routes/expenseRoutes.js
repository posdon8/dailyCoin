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

const router = express.Router();

// CRUD Routes
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// Advanced Routes
router.get('/range/search', getExpensesByDateRange);
router.get('/month/search', getExpensesByMonth);
router.get('/stats/analytics', getExpenseStats);

// Cleanup (Testing only)
router.delete('/', deleteAllExpenses);

export default router;

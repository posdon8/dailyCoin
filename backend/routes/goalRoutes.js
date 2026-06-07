import express from 'express';
import {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addAmountToGoal,
  getGoalStats,
} from '../controllers/goalController.js';

const router = express.Router();

// Get all goals and statistics
router.get('/', getAllGoals);
router.get('/stats', getGoalStats);

// Get specific goal
router.get('/:id', getGoalById);

// Create new goal
router.post('/', createGoal);

// Update goal
router.put('/:id', updateGoal);

// Delete goal
router.delete('/:id', deleteGoal);

// Add amount to goal
router.post('/:id/add-amount', addAmountToGoal);

export default router;

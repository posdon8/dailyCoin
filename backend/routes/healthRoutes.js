import express from 'express';
import {
  calculateScore,
  getScore,
  chatWithAI,
  getScoreHistory,
} from '../controllers/healthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Calculate new health score
router.post('/calculate', calculateScore);

// Get current health score
router.get('/score', getScore);

// Get score history (last 30 days)
router.get('/history', getScoreHistory);

// Chat with AI about finances
router.post('/chat', chatWithAI);

export default router;

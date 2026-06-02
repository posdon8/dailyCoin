import express from 'express';
import {
  getAllDebts,
  getDebtById,
  createDebt,
  updateDebt,
  deleteDebt,
  getDebtStats,
  recordPayment,
  searchDebts,
} from '../controllers/debtController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isEmailConfigured } from '../services/emailService.js';

const router = express.Router();
router.use(protect);

// CRUD Routes
router.get('/', getAllDebts);
router.get('/search/query', searchDebts);
router.get('/stats/analytics', getDebtStats);
router.get('/:id', getDebtById);
router.post('/', createDebt);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);

// Payment Routes
router.post('/:id/payment', recordPayment);

// Email Configuration Check
router.get('/config/email-status', (req, res) => {
  res.json({
    success: true,
    emailConfigured: isEmailConfigured(),
    message: isEmailConfigured() 
      ? 'Email notification service is configured' 
      : 'Email notification service is not configured',
  });
});

export default router;

import express from 'express';
import {
  getWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  getWalletBalance,
  updateWalletBalance,
  getWalletsSummary,
} from '../controllers/walletController.js';

const router = express.Router();

// GET    /api/wallets               — Lấy tất cả ví
// GET    /api/wallets/summary/total — Tổng hợp tất cả ví
// GET    /api/wallets/:id           — Lấy chi tiết ví
// GET    /api/wallets/:id/balance   — Lấy số dư + stats
// POST   /api/wallets               — Tạo ví mới
// PUT    /api/wallets/:id           — Cập nhật ví
// PUT    /api/wallets/:id/balance   — Cập nhật số dư
// DELETE /api/wallets/:id           — Xóa ví

router.get('/summary/total', getWalletsSummary);
router.get('/', getWallets);
router.post('/', createWallet);
router.get('/:id', getWalletById);
router.get('/:id/balance', getWalletBalance);
router.put('/:id', updateWallet);
router.put('/:id/balance', updateWalletBalance);
router.delete('/:id', deleteWallet);

export default router;

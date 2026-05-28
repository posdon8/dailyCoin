import express from 'express';
import { register, login, logout, getCurrentUser, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import passport from '../config/passport.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}?error=google_auth_failed`,
    session: false,
  }),
  googleCallback
);
export default router;

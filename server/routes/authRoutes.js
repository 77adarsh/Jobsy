// routes/authRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword
} from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { check } from 'express-validator';

const router = express.Router();

// User Registration
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  registerUser
);

// User Login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// Get User Data (for /me)
router.get('/me', verifyToken, getUserProfile);

// Forgot Password Route
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], forgotPassword);

export default router;

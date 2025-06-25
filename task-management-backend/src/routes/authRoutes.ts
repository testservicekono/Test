// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getAuthenticatedUser } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/user
// @desc    Get authenticated user data
// @access  Private (requires token)
router.get('/user', authMiddleware, getAuthenticatedUser);

export default router;

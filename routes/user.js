import { Router } from 'express';
import {
	signup,
	login,
	getUserInfo,
	refreshToken,
} from '../controllers/user.js';

// Import middleware
import authMiddleware from '../middlewares/authMiddleware.js';
const router = Router();

// // login user
router.post('/login', login);

// //new user
router.post('/signup', signup);

// //get user info
router.post('/me', authMiddleware, getUserInfo);

router.post('/refresh-token', refreshToken);
export default router;

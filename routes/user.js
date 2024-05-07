import { Router } from 'express';
import {
	signup,
	login,
	getUsers,
	getUserInfo,
	deleteUser,
	refreshToken,
} from '../controllers/user.js';

// Import middleware
import authMiddleware from '../middlewares/authMiddleware.js';
const router = Router();

// //new user
router.post('/signup', signup);

// // login user
router.post('/login', login);
// //get user info
router.post('/me', authMiddleware, getUserInfo);

router.get('/', getUsers);
router.delete('/', deleteUser);
// get refresh token
router.post('/refresh-token', refreshToken);
export default router;

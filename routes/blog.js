import { Router } from 'express';
import {
	createBlog,
	getBlog,
	getUserBlogs,
	getBlogs,
	updateBlog,
	deleteBlog,
} from '../controllers/blog.js';
// Import middleware
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();
router.get('/', getBlogs);
//get all user blog
router.get('/user', authMiddleware, getUserBlogs);
router.get('/:id', getBlog);
router.post('/', authMiddleware, createBlog);
router.patch('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;

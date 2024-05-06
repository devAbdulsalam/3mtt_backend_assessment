import User from '../models/User.js';
import Blog from '../models/Blog.js';
import logger from '../logger/logger.js';

// User Signup endpoint
export const createBlog = async (req, res) => {
	try {
		const { title, description, tags, body, state } = req.body;
		const userId = req.user._id;

		const newBlog = new Blog({
			title,
			description,
			author: userId,
			tags,
			body,
			state, // Initial state is draft
		});
		await newBlog.save();

		res
			.status(201)
			.json({ message: 'Blog created successfully', blog: newBlog });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

const calculateReadingTime = (content) => {
	// Assuming 200 words per minute reading speed
	const wordsPerMinute = 200;
	const words = content?.split(' ').length;
	const readingTimeMinutes = Math.ceil(words / wordsPerMinute);
	return readingTimeMinutes;
};

// Read Blog
export const getBlog = async (req, res) => {
	try {
		const blog = await Blog.findById({ _id: req.params.id }).populate(
			'author',
			'firstName lastName'
		);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}
		// Update read count
		blog.readCount += 1;
		await blog.save();
		// Calculate reading time
		const readingTimeMinutes = calculateReadingTime(blog.body);
		// Log event
		// logger.info(`Blog ${blog._id} requested by ${req.user._id}`);
		res.json({ blog, readingTimeMinutes });
	} catch (error) {
		logger.error(`Error fetching blog: ${error}`);
		res.status(500).json({ error: 'Server error' });
	}
};

export const getUserBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find({ author: req.params.id });
		res.json(blogs);
	} catch (error) {
		logger.error(`Error fetching blog: ${error}`);
		res.status(500).json({ error: 'Server error' });
	}
};
// Read Blogs
export const getBlogs = async (req, res) => {
	try {
		let query = { state: 'published' };

		// Pagination
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const skip = (page - 1) * limit;

		// Filtering
		if (req.query.id) {
			query._id = req.query.id;
		}
		if (req.query.author) {
			query.author = req.query.author;
		}
		if (req.query.title) {
			query.title = { $regex: req.query.title, $options: 'i' }; // Case-insensitive search
		}
		if (req.query.tags) {
			query.tags = { $in: req.query.tags.split(',') };
		}

		// Sorting
		let sort = { timestamp: -1 }; // Default sorting by timestamp
		if (req.query.sortBy) {
			const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
			sort = { [req.query.sortBy]: sortOrder };
		}
		// Execute query
		const blogs = await Blog.find(query)
			.populate('author', 'firstName lastName')
			.sort(sort)
			.skip(skip)
			.limit(limit);

		res.json(blogs);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Update Blog
export const updateBlog = async (req, res) => {
	try {
		const userId = req.user._id;
		const blogId = req.params.id;
		const { title, description, tags, body, state } = req.body;

		let blog = await Blog.findById(blogId);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}

		if (blog.author.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ error: 'You are not authorized to edit this blog' });
		}

		blog.title = title;
		blog.description = description;
		blog.tags = tags;
		blog.body = body;
		blog.state = state;

		await blog.save();

		res.json({ message: 'Blog updated successfully', blog });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

// Delete Blog
export const deleteBlog = async (req, res) => {
	try {
		const userId = req.user._id;
		const blogId = req.params.id;

		let blog = await Blog.findById(blogId);
		if (!blog) {
			return res.status(404).json({ error: 'Blog not found' });
		}

		if (blog.author.toString() !== userId.toString()) {
			return res
				.status(403)
				.json({ error: 'You are not authorized to delete this blog' });
		}
		await Blog.findByIdAndDelete(blogId);

		res.json({ message: 'Blog deleted successfully' });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: 'Server error' });
	}
};

import jwt from 'jsonwebtoken';
export const createToken = (userId) => {
	return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '1h',
	});
};

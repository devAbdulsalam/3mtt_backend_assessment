describe('GET /blog', () => {
	test('It should return the blog with author information and reading time', async () => {
		const response = await request(app).get('/blog/1');
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('blog');
		expect(response.body).toHaveProperty('readingTimeMinutes');
	});
});

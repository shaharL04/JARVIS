import news from '../api/news.js';
class newsController {
    async getLatestNewsByCategory(req, res) {
        const category = req.query.category;
        try {
            const latestNews = await news.getLatestNewsByCategory(category);
            res.status(201).json(latestNews);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
}
export default new newsController;
//# sourceMappingURL=newsController.js.map
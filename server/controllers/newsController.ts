import { Request, Response } from 'express';
import news from '../services/news.js'
class newsController{
    async getLatestNewsByCategory(req: Request, res: Response) {
          const category = req.query.category as string;
          try{
            const latestNews = await news.getLatestNewsByCategory(category)
            res.status(201).json(latestNews);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
          }
    }
}

export default new newsController
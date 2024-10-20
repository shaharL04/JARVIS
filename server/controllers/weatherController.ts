import { Request, Response } from 'express';
import weather from '../api/weather.js';

class weatherController{
    async getWheatherPerLocation(req: Request, res: Response) {
          const location = req.query.location as string;
          try{
            const weatherForLocation = await weather.getWheatherPerLocation(location)
            res.status(201).json(weatherForLocation);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
          }
    }
}

export default new weatherController
import { Request, Response } from 'express';
import financeService from '../api/financeService.js';

class financeController{
    async convertTwoCurrencies(req: Request, res: Response) {
       
          const currenciesData = req.query.currenciesData as string;
          console.log(currenciesData)
          try{
            const convertCurrenciesRes = await financeService.convertTwoCurrencies(currenciesData)
            res.status(201).json(convertCurrenciesRes);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
          }
    }
}

export default new financeController
import { Request, Response } from 'express';
import outlookService from '../services/outlookService.js';
class outlookController{
    async createEvent(req: Request, res: Response) {
          const { eventData } = req.body; // Extract eventData from the request body

        // Check if eventData is provided
        if (!eventData) {
            res.status(400).json({ error: 'Event data is required' });
            return;
        }
          try{
            const accessToken = req.user
            const createNewEvent = await outlookService.createEvent(eventData,accessToken );
            res.status(201).json(createNewEvent);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
          }
    }

        async sendEmail(req: Request, res: Response) {
          const { emailData } = req.body; // Extract eventData from the request body

            // Check if eventData is provided
            if (!emailData) {
                res.status(400).json({ error: 'email data is required' });
                return;
            }
              try{
                const accessToken = req.user
                console.log(emailData, accessToken)
                const sendNewEmail = await outlookService.sendEmail(emailData,accessToken );
                res.status(201).json(sendNewEmail);
              }catch(error){
                console.log('error getting all users:', error);
                res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
              }
        }

        async getEventsOnCertainDates(req: Request, res: Response){
          const { startDate, endDate } = req.body;
          try{
            const accessToken = req.user
            const getEventsOnDates = await outlookService.getEventsOnCertainDates(startDate,endDate ,accessToken );
            res.status(201).json(getEventsOnDates);
          }catch(error){
            console.log('error getting all users:', error);
            res.status(500).json({message: 'An error occurred while getting all users.', type:"error"})
          }
        }
}

export default new outlookController
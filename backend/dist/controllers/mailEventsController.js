import mailEventsService from '../services/outlookService.js';
class mailEventsController {
    async createEvent(req, res) {
        const { eventData } = req.body; // Extract eventData from the request body
        // Check if eventData is provided
        if (!eventData) {
            res.status(400).json({ error: 'Event data is required' });
            return;
        }
        try {
            const accessToken = req.session.accessToken;
            const createNewEvent = await mailEventsService.createEvent(eventData, accessToken);
            res.status(201).json(createNewEvent);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
    async sendEmail(req, res) {
        const { emailData } = req.body; // Extract eventData from the request body
        // Check if eventData is provided
        if (!emailData) {
            res.status(400).json({ error: 'email data is required' });
            return;
        }
        try {
            const accessToken = req.session.accessToken;
            console.log(emailData, accessToken);
            const sendNewEmail = await mailEventsService.sendEmail(emailData, accessToken);
            res.status(201).json(sendNewEmail);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
    async getEventsOnCertainDates(req, res) {
        const { startDate, endDate } = req.body;
        try {
            const accessToken = req.session.accessToken;
            const getEventsOnDates = await mailEventsService.getEventsOnCertainDates(startDate, endDate, accessToken);
            res.status(201).json(getEventsOnDates);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
}
export default new mailEventsController;
//# sourceMappingURL=mailEventsController.js.map
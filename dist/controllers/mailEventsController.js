import mailEventsService from '../api/mailEventsService.js';
class mailEventsController {
    async createEvent(req, res) {
        const { eventData } = req.body; // Extract eventData from the request body
        // Check if eventData is provided
        if (!eventData) {
            res.status(400).json({ error: 'Event data is required' });
            return;
        }
        try {
            const accessToken = req.headers.authorization?.split(' ')[1];
            console.log(eventData, accessToken);
            const createNewEvent = await mailEventsService.createEvent(eventData, accessToken);
            res.status(201).json(createNewEvent);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
}
export default new mailEventsController;
//# sourceMappingURL=mailEventsController.js.map
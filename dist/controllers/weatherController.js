import weather from '../api/weather.js';
class weatherController {
    async getWheatherPerLocation(req, res) {
        console.log(req.body);
        try {
            const weatherForLocation = await weather.getWheatherPerLocation("test");
            res.status(201).json(weatherForLocation);
        }
        catch (error) {
            console.log('error getting all users:', error);
            res.status(500).json({ message: 'An error occurred while getting all users.', type: "error" });
        }
    }
}
export default new weatherController;
//# sourceMappingURL=weatherController.js.map
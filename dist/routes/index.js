import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import weatherController from '../controllers/weatherController.js';
import mailEventsController from '../controllers/mailEventsController.js';
import verifyToken from '../middlewares/accessTokenMiddleware.js';
const router = Router();
router.get('/getWeatherPerLocation', weatherController.getWheatherPerLocation);
router.get('/getLatestNewsByCategory', newsController.getLatestNewsByCategory);
router.post('/createNewEvent', verifyToken, mailEventsController.createEvent);
export default router;
//# sourceMappingURL=index.js.map
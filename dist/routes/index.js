import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import weatherController from '../controllers/weatherController.js';
const router = Router();
router.get('/getWeatherPerLocation', weatherController.getWheatherPerLocation);
router.get('/getLatestNewsByCategory', newsController.getLatestNewsByCategory);
export default router;
//# sourceMappingURL=index.js.map
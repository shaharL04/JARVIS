import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import weatherController from '../controllers/weatherController.js';
import mailEventsController from '../controllers/mailEventsController.js';
import financeController from '../controllers/financeController.js';
import verifyToken from '../middlewares/accessTokenMiddleware.js';

const router: Router = Router();

router.get('/getWeatherPerLocation', weatherController.getWheatherPerLocation )
router.get('/getLatestNewsByCategory', newsController.getLatestNewsByCategory )
router.get('/convertTwoCurrencies', financeController.convertTwoCurrencies)


router.post('/createNewEvent',verifyToken , mailEventsController.createEvent )
router.post('/getEventsOnCertainDates',verifyToken , mailEventsController.getEventsOnCertainDates )
router.post('/sendNewEmail',verifyToken , mailEventsController.sendEmail )


export default router;
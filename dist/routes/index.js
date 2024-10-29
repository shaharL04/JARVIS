import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import weatherController from '../controllers/weatherController.js';
import outlookController from '../controllers/outlookController.js';
import googleController from '../controllers/googleController.js';
import financeController from '../controllers/financeController.js';
import verifyOutlookTokenMiddleware from '../middlewares/verifyOutlookTokenMiddleware.js';
import verifyGoogleTokenMiddleware from '../middlewares/verifyGoogleTokenMiddleware.js';
import microsoftAuthRouter from '../auth/microsoft/microsoftAuthRouter.js';
import googleAuthRouter from '../auth/google/googleAuthRouter.js';
const router = Router();
router.get('/getWeatherPerLocation', weatherController.getWheatherPerLocation);
router.get('/getLatestNewsByCategory', newsController.getLatestNewsByCategory);
router.get('/convertTwoCurrencies', financeController.convertTwoCurrencies);
//outlook events
router.post('/createOutlookEvent', verifyOutlookTokenMiddleware, outlookController.createEvent);
router.post('/getOutlookEventsOnCertainDates', verifyOutlookTokenMiddleware, outlookController.getEventsOnCertainDates);
router.post('/sendOutlookEmail', verifyOutlookTokenMiddleware, outlookController.sendEmail);
//google events
router.post('/createGoogleEvent', verifyGoogleTokenMiddleware, googleController.createEvent);
router.post('/getGoogleEventsOnCertainDates', verifyGoogleTokenMiddleware, googleController.getEventsOnCertainDates);
router.post('/sendGoogleEmail', verifyGoogleTokenMiddleware, googleController.sendEmail);
//authentaction routes
router.use('/auth/microsoft', microsoftAuthRouter);
router.use('/auth/google', googleAuthRouter);
export default router;
//# sourceMappingURL=index.js.map
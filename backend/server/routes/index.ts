import { Router } from 'express';
import newsController from '../controllers/newsController.js';
import weatherController from '../controllers/weatherController.js';
import outlookController from '../controllers/outlookController.js';
import googleController from '../controllers/googleController.js';
import financeController from '../controllers/financeController.js';
import verifyJwtMiddleware from '../middlewares/jwtMiddleware.js';
import verifyOutlookTokenMiddleware from '../middlewares/verifyOutlookTokenMiddleware.js';
import verifyGoogleTokenMiddleware from '../middlewares/verifyGoogleTokenMiddleware.js';
import microsoftAuthRouter from '../auth/microsoft/microsoftAuthRouter.js';
import googleAuthRouter from '../auth/google/googleAuthRouter.js';

const router: Router = Router();

router.get('/getWeatherPerLocation', weatherController.getWheatherPerLocation )
router.get('/getLatestNewsByCategory', newsController.getLatestNewsByCategory )
router.get('/convertTwoCurrencies', financeController.convertTwoCurrencies)

//outlook events
router.post('/createOutlookEvent', verifyJwtMiddleware ,verifyOutlookTokenMiddleware , outlookController.createEvent )
router.post('/getOutlookEventsOnCertainDates', verifyJwtMiddleware ,verifyOutlookTokenMiddleware , outlookController.getEventsOnCertainDates )
router.post('/sendOutlookEmail', verifyJwtMiddleware ,verifyOutlookTokenMiddleware , outlookController.sendEmail )

//google events
router.post('/createGoogleEvent', verifyJwtMiddleware ,verifyGoogleTokenMiddleware , googleController.createEvent )
router.post('/getGoogleEventsOnCertainDates', verifyJwtMiddleware ,verifyGoogleTokenMiddleware , googleController.getEventsOnCertainDates )
router.post('/sendGoogleEmail', verifyJwtMiddleware ,verifyGoogleTokenMiddleware , googleController.sendEmail )

//authentaction routes
router.use('/auth/microsoft', microsoftAuthRouter);
router.use('/auth/google', googleAuthRouter);


export default router;
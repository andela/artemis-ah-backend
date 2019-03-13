import express from 'express';
import articleRoutes from './articles';
import authRoute from './users';
import profileRoutes from './profile';
import reportRoutes from './report';
import bookmarkRoutes from './bookmark';
import articleClapRoute from './articleClap';
import articleSearchRoute from './articleSearch';
import notificationRoutes from './notifications';

const router = express.Router();

router.use(bookmarkRoutes);
router.use(articleRoutes);
router.use(authRoute);
router.use(profileRoutes);
router.use(reportRoutes);
router.use(articleClapRoute);
router.use(articleSearchRoute);
router.use(notificationRoutes);

export default router;

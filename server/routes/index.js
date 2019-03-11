import express from 'express';
import articleRoutes from './articles';
import authRoute from './users';
import profileRoutes from './profile';
import reportRoutes from './report';
import articleClapRoute from './articleClap';

const router = express.Router();

router.use(articleRoutes);
router.use(authRoute);
router.use(profileRoutes);
router.use(reportRoutes);
router.use(articleClapRoute);


export default router;

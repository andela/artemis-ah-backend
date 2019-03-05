import express from 'express';
import articleRoutes from './articles';
import authRoute from './users';
import profileRoutes from './profile';

const router = express.Router();

router.use(articleRoutes);
router.use(authRoute);
router.use(profileRoutes);

export default router;

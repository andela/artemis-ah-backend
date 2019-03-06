import express from 'express';
import articleRoutes from './articles';
import authRoute from './users';
import profileRoutes from './profile';
import bookmarkRoutes from './bookmark';

const router = express.Router();

router.use(articleRoutes);
router.use(authRoute);
router.use(profileRoutes);
router.use(bookmarkRoutes);

export default router;

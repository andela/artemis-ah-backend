import express from 'express';
import articleRoutes from './articles';
import userRoutes from './users';
import profileRoutes from './profile';

const router = express.Router();

router.use(articleRoutes);
router.use(userRoutes);
router.use(profileRoutes);

export default router;

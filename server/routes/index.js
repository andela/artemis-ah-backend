import express from 'express';
import articleRoutes from './articles';
import authRoute from './users';

const router = express.Router();

router.use(articleRoutes);
router.use(authRoute);

export default router;

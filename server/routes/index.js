import express from 'express';
import articleRoutes from './articles'; 

const router = express.Router();

router.use(articleRoutes);

export default router;

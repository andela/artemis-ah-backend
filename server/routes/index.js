import express from 'express';
import articleRoutes from './api/articles'; 

const router = express.Router();

router.use(articleRoutes);

export default router;

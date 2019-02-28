import express from 'express';
import ArticleController from '../controllers/article';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles', controller.create.bind(controller));

export default router;

import express from 'express';
import ArticleController from '../controllers/article';
import createArticleValidation from '../validations/create-article';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles', createArticleValidation, controller.create.bind(controller));

export default router;

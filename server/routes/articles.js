import express from 'express';
import ArticleController from '../controllers/article';
import createArticleValidation from '../validations/create-article';
import AuthenticateUser from '../middlewares/AuthenticateUser';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles',
  AuthenticateUser.verifyUser,
  createArticleValidation,
  controller.create.bind(controller));

export default router;

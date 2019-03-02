import express from 'express';
import ArticleController from '../controllers/article';
import createArticleValidation from '../validations/create-article';
import AuthenticateUser from '../middlewares/AuthenticateUser';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles',
  AuthenticateUser.verifyUser,         // User must be logged in first
  createArticleValidation,             // Validate user input
  controller.create.bind(controller));

router.get('/articles',
  controller.getAll.bind(controller));

export default router;

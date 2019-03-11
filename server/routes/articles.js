import express from 'express';
import { ArticleController, Comment } from '../controllers';
import createArticleValidation from '../validations/create-article';
import ArticleCommentLikeController from '../controllers/article-comment-like';
import { AuthenticateUser, ValidateComment } from '../middlewares';
import rateArticleValidation from '../validations/rate-article';
import AuthenticateArticle from '../middlewares/AuthenticateArticle';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles',
  AuthenticateUser.verifyUser, // User must be logged in first
  createArticleValidation, // Validate user input
  controller.create.bind(controller));
router.post('/articles/:slug/comment',
  AuthenticateUser.verifyUser,
  ValidateComment.validateMethods(),
  ValidateComment.validateComment,
  Comment.postComment);

router.get('/articles/tags', controller.getTags.bind(controller));
router.get('/articles', controller.getAll.bind(controller));
router.get('/articles/:slug', controller.getSingleArticle.bind(controller));

const articleCommentLike = new ArticleCommentLikeController();
router.post('/articles/:slug/comments/:id/like',
  AuthenticateUser.verifyUser, // User has to logged in first
  articleCommentLike.likeToggle.bind(articleCommentLike));

router.post('/articles/rating/:slug',
  AuthenticateUser.verifyUser,
  rateArticleValidation, // Validate user input
  AuthenticateArticle.verifyArticle,
  controller.rateArticle.bind(controller));

router.get('/articles/rating/:slug',
  AuthenticateArticle.verifyArticle,
  controller.getRatings.bind(controller));

router.patch('/articles/:slug/comment/:commentId',
  AuthenticateUser.verifyUser,
  ValidateComment.validateMethods(true),
  ValidateComment.validateComment,
  Comment.updateComment);

export default router;

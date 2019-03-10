import express from 'express';
import { ArticleController, Comment } from '../controllers';
import createArticleValidation from '../validations/create-article';
import ArticleCommentLikeController from '../controllers/article-comment-like';
import { AuthenticateUser, ValidateComment, AuthenticateArticle } from '../middlewares';
import rateArticleValidation from '../validations/rate-article';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles',
  AuthenticateUser.verifyUser, // User must be logged in first
  createArticleValidation, // Validate user input
  controller.create.bind(controller));
router.post('/articles/:slug/comment',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  ValidateComment.validateMethods('create', false),
  ValidateComment.validateComment,
  Comment.postComment);

router.get('/articles/tags',
  controller.getTags.bind(controller));
router.get('/articles', controller.getAll.bind(controller));
router.get('/articles/:slug',
  AuthenticateArticle.verifyArticle,
  AuthenticateUser.identifyUser,
  controller.getSingleArticle.bind(controller));

const articleCommentLike = new ArticleCommentLikeController();
router.post('/articles/:slug/comments/:id/like',
  AuthenticateUser.verifyUser, // User has to logged in first
  articleCommentLike.likeToggle.bind(articleCommentLike));

router.post('/articles/:slug/rating/',
  AuthenticateUser.verifyUser,
  rateArticleValidation, // Validate user input
  AuthenticateArticle.verifyArticle,
  controller.rateArticle.bind(controller));

router.get('/articles/:slug/rating',
  AuthenticateArticle.verifyArticle,
  controller.getRatings.bind(controller));

router.patch('/articles/:slug',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  createArticleValidation,
  controller.updateArticle.bind(controller));
router.patch('/articles/:slug/comment/:commentId',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  ValidateComment.validateMethods('update', true),
  ValidateComment.validateComment,
  Comment.updateComment);

router.delete('/articles/:slug/comment/:commentId',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  ValidateComment.validateMethods('delete', true),
  ValidateComment.validateComment,
  Comment.deleteComment);

export default router;

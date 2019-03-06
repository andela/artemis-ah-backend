import express from 'express';
import { ArticleController, Comment } from '../controllers';
import createArticleValidation from '../validations/create-article';
import AuthenticateUser from '../middlewares/AuthenticateUser';
import ArticleCommentLikeController from '../controllers/article-comment-like';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles',
  AuthenticateUser.verifyUser, // User must be logged in first
  createArticleValidation, // Validate user input
  controller.create.bind(controller));
router.post('/articles/:slug/comment', AuthenticateUser.verifyUser, Comment.postComment);

router.get('/articles/tags',
  controller.getTags.bind(controller));
router.get('/articles', controller.getAll.bind(controller));
router.get('/articles/:slug', controller.getSingleArticle.bind(controller));

const articleCommentLike = new ArticleCommentLikeController();
router.post('/articles/:slug/comments/:id/like',
  AuthenticateUser.verifyUser, // User has to logged in first
  articleCommentLike.likeToggle.bind(articleCommentLike));

export default router;

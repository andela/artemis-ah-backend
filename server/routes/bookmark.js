import express from 'express';
import BookmarkController from '../controllers/bookmark';
import { AuthenticateUser, AuthenticateArticle } from '../middlewares';

const bookmarkRoutes = express.Router();

bookmarkRoutes.post('/articles/:slug/bookmark',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  BookmarkController.createBookmark);

bookmarkRoutes.delete('/articles/:slug/bookmark',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  BookmarkController.removeBookmark);

bookmarkRoutes.get('/bookmarks',
  AuthenticateUser.verifyUser,
  BookmarkController.getBookmarks);

export default bookmarkRoutes;

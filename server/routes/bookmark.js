import express from 'express';
import BookmarkController from '../controllers/bookmark';
import { AuthenticateUser, AuthenticateArticle } from '../middlewares';

const bookmarkRoutes = express.Router();

bookmarkRoutes.post('/articles/:slug/bookmark',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  AuthenticateArticle.verifyArticle,
  BookmarkController.createBookmark);

bookmarkRoutes.delete('/articles/:slug/bookmark',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  AuthenticateArticle.verifyArticle,
  BookmarkController.removeBookmark);

bookmarkRoutes.get('/bookmarks',
  AuthenticateUser.verifyUser,
  AuthenticateUser.verifyActiveUser,
  BookmarkController.getBookmarks);

export default bookmarkRoutes;

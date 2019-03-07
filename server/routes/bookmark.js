import express from 'express';
import BookmarkController from '../controllers/bookmark';
import AuthenticateUser from '../middlewares/AuthenticateUser';

const bookmarkRoutes = express.Router();

bookmarkRoutes.post('/bookmark/:slug',
  AuthenticateUser.verifyUser,
  BookmarkController.createBookmark);

bookmarkRoutes.delete('/articles/:slug/bookmark',
  AuthenticateUser.verifyUser,
  BookmarkController.removeBookmark);

bookmarkRoutes.get('/bookmark',
  AuthenticateUser.verifyUser,
  BookmarkController.getBookmarks);

export default bookmarkRoutes;

import express from 'express';
import { ArticleClap } from '../controllers';
import { AuthenticateUser, AuthenticateArticle } from '../middlewares';

const articleClapRoute = express.Router();

// Article toggle route
articleClapRoute.post('/articles/:slug/clapToggle',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  ArticleClap.clapToggle);

export default articleClapRoute;

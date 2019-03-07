import express from 'express';
import { ArticleClap } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const articleClapRoute = express.Router();

// Article toggle route
articleClapRoute.post('/articles/:slug/clapToggle', AuthenticateUser.verifyUser, ArticleClap.clapToggle);

export default articleClapRoute;

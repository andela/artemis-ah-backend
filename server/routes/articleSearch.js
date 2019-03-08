import express from 'express';
import { ArticleSearch } from '../controllers';

const articleSearchRouter = express.Router();

// Article search route
articleSearchRouter.get('/search', ArticleSearch.search);

// Article filter route
articleSearchRouter.get('/filter', ArticleSearch.filter);

export default articleSearchRouter;

import express from 'express';
import ArticleController from '../controllers/article';
import AuthenticateUser from '../middlewares/AuthenticateUser';

const router = express.Router();

const controller = new ArticleController();

router.post('/articles', controller.create.bind(controller));
router.get('/articles', AuthenticateUser.verifyUser);

export default router;

import { Article } from '../database/models/index';
import BaseController from './base-controller';

class ArticleController extends BaseController {
  create(req, res) {
    this.response(res).success('This end point will create a new article.');
  }
}

export default ArticleController;

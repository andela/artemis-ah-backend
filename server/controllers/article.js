import { Article } from '../database/models/index';
import BaseController from './base-controller';

class ArticleController extends BaseController {
  create(req, res) {
    this.response(res).success('Hello');
  }
}

export default ArticleController;

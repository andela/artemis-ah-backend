import { Article } from '../database/models/index';
import response from '../utils/response';

class ArticleController {
  create(req, res) {
    response(res).success('This end point will create a new article.');
  }
}

export default ArticleController;

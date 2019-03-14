import { response } from '../utils';
import db from '../database/models';

const { Article } = db;
/**
 * @class AuthenticateArticle
 * @description Authenticates articles
 * @exports AuthenticateArticle
 */
class AuthenticateArticle {
  /**
   * @method verifyArticle
   * @description Verifies that the article exists in the db
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {object} next - Function to pass to the next middleware
   * @returns {object} - JSON response object
   */
  static async verifyArticle(req, res, next) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({ where: { slug } });
      if (article) {
        req.article = article;
        return next();
      }
      response(res).notFound({
        message: 'article not found'
      });
    } catch (error) {
      return response(res).serverError({
        message: 'Could not check for article'
      });
    }
  }
}

export default AuthenticateArticle;

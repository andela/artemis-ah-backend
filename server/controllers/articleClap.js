import db from '../database/models';
import { response } from '../utils';

const { Article, ArticleClap } = db;

/**
 * @description Class to implement clap and unclap
 */
export default class ArticleClapToggle {
  /**
     * @description claps and retrieves claap from articles
     * @param {object} req
     * @param {object} res
     * @returns {object} response object
     */
  static async clapToggle(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    try {
      const getArticle = await Article.findOne({ where: { slug } });

      if (!getArticle) response(res).notFound({ message: 'article not found' });

      else if (getArticle.userId === id) response(res).forbidden({ message: 'you cannot clap for your own article' });

      else {
        const clap = await ArticleClap.findOrCreate({
          where: { userId: id, articleId: getArticle.id },
          defaults: { clap: true }
        });

        if (clap[1] === true) response(res).created({ message: 'you just clapped for this article' });

        else {
          await ArticleClap.destroy({
            where: { userId: id, articleId: getArticle.id }
          });

          response(res).success({ message: 'you just retrieved your clap' });
        }
      }
    } catch (err) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }
}

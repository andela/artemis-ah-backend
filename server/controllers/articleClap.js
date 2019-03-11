import db from '../database/models';
import { response } from '../utils';

const { ArticleClap, Article } = db;

/**
 * @description Class to implement clap and unclap
 */
export default class ArticleClapToggle {
  /**
   * @description increaments total claps
   * @param {number} totalClaps
   * @param {number} articleId
   * @returns {nothing} err
   */
  static async incrementTotalClaps(totalClaps, articleId) {
    const newTotalClaps = totalClaps + 1;
    await Article.update({ totalClaps: newTotalClaps },
      { where: { id: articleId } });
  }

  /**
   * @description decreases total claps
   * @param {number} totalClaps
   * @param {number} articleId
   * @returns {nothing} err
   */
  static async decreaseTotalClaps(totalClaps, articleId) {
    const newTotalClaps = totalClaps - 1;
    await Article.update({ totalClaps: newTotalClaps },
      { where: { id: articleId } });
  }

  /**
     * @description claps and retrieves claap from articles
     * @param {object} req
     * @param {object} res
     * @returns {object} response object
     */
  static async clapToggle(req, res) {
    const { id } = req.user;
    const { article } = req;

    try {
    // Check if current user is author
      if (article.userId === id) {
        response(res).forbidden({ message: 'you cannot clap for your own article' });
      } else {
      // Add a clap
        const clap = await ArticleClap.findOrCreate({
          where: { userId: id, articleId: article.id },
          defaults: { clap: true }
        });

        if (clap[1] === true) {
        // Increament total claps on article
          await ArticleClapToggle.incrementTotalClaps(article.totalClaps, article.id);

          response(res).created({ message: 'you just clapped for this article' });
        } else {
          await ArticleClap.destroy({
            where: { userId: id, articleId: article.id }
          });
          // Decrease total claps on article
          await ArticleClapToggle.decreaseTotalClaps(article.totalClaps, article.id);

          response(res).success({ message: 'you just retrieved your clap' });
        }
      }
    } catch (err) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }
}

import models from '../database/models';
import response from '../utils/response';

const { ArticleComment, Article } = models;

/**
 * @class ArticleComment
 * @description Controller to handle comment request
 * @exports ArticleComment
 */
class Comment {
  /**
   * @method postComment
   * @description - Posts comment to the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The article object
   */
  static async postComment(req, res) {
    const { slug } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    try {
      const article = await Article.findOne({
        attributes: ['id'],
        where: {
          slug
        }
      });

      const articleId = article.id;
      const userComment = await ArticleComment.create({ articleId, comment, userId });
      delete userComment.dataValues.id;
      return response(res).created({ userComment });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }

  /**
   * @method updateComment
   * @description - Updates comment
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The updated article object
   */
  static async updateComment(req, res) {
    const { slug } = req.params;
    const { comment } = req.body;

    try {
      const article = await Article.findOne({
        attributes: ['id'],
        where: {
          slug
        }
      });

      const articleId = article.id;
      const articleUpdate = await ArticleComment.update({ comment }, {
        where: {
          articleId
        },
        returning: true,
        raw: true
      });
      const userComment = articleUpdate[1][0];
      delete userComment.id;
      return response(res).success({ userComment });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }
}

export default Comment;

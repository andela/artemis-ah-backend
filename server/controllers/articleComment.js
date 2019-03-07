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
      return response(res).created({
        message: 'Comment created successfully',
        userComment
      });
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
    const { commentRow } = req;
    const { comment } = req.body;

    try {
      const { id } = commentRow;
      const articleUpdate = await ArticleComment.update({ comment }, {
        where: {
          id
        },
        returning: true
      });
      const userComment = articleUpdate[1][0];
      return response(res).success({
        message: 'Comment updated successfully',
        userComment
      });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }

  /**
   * @method deleteComment
   * @description - Deletes comment
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The updated article object
   */
  static async deleteComment(req, res) {
    const { commentRow } = req;

    try {
      const { id } = commentRow;
      await ArticleComment.destroy({
        where: {
          id
        }
      });
      return response(res).success({ message: 'Comment has been deleted successfully.' });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }
}

export default Comment;

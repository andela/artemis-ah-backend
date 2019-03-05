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
    const { comment } = req.body;
    const article = await Article.findOne({
      attributes: ['id'],
      where: {
        slug
      }
    });
    const articleId = article.id;
    try {
      const userComment = await ArticleComment.create({ articleId, comment, userId: 1, });
      delete userComment.dataValues.id;
      return response(res).created({ message: { userComment } });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }
}

export default Comment;

/* eslint class-methods-use-this: ["error", {
  "exceptMethods": [
    "promiseError",
    "getUserLikeRecord",
    "addLike",
    "removeLike"
  ]
}] */
import models from '../database/models';
import response from '../utils/response';

const { Article, ArticleComment, ArticleCommentLike } = models;

/**
 * @class ArticleCommentController
 * @exports ArticleCommentLikeController
 */
class ArticleCommentLikeController {
  /**
   * @method likeToggle
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined} nothing
   */
  async likeToggle(req, res) {
    const { user } = req;

    try {
      // Find article by slug.
      const article = await Article.findOne({
        where: {
          slug: req.params.slug,
        },
      });

      // Does article exists?
      if (!article) {
        return response(res).notFound('Article does not exists');
      }

      // Get comment by article id and comment id.
      const comment = await ArticleComment.findOne({
        where: {
          id: req.params.id,
          articleId: article.id,
        },
      });

      // Does comment exists?
      if (!comment) {
        return response(res).notFound('Comment does not exists');
      }

      // Get user like record
      const userLikeRecord = await this.getUserLikeRecord(user, comment);
      let result;
      // Has user liked before?
      if (userLikeRecord) {
        result = await this.removeLike(user, comment);
      } else {
        result = await this.addLike(user, comment);
      }
      response(res).success(result);
    } catch (e) {
      return response(res).serverError('Something went wrong. Try again soon.');
    }
  }

  /**
   * @method getUserLikeRecord
   * @param {*} user Logged in user object
   * @param {*} comment Comment record from database
   * @returns {Promise} promise to fetch user's like record
   */
  getUserLikeRecord(user, comment) {
    return ArticleCommentLike.findOne({
      where: {
        userId: user.id,
        commentId: comment.id,
        articleId: comment.articleId,
      },
    });
  }

  /**
   * @param {*} user The user object
   * @param {*} comment The comment record
   * @returns {object} Returns the server response
   */
  async addLike(user, comment) {
    await ArticleCommentLike.create({
      userId: user.id,
      articleId: comment.articleId,
      commentId: comment.id,
    });
    const updatedComment = await comment.increment('totalLikes');
    return {
      totalLikes: updatedComment.totalLikes,
      liked: true,
    };
  }

  /**
   * @param {*} user The user object
   * @param {*} comment The comment record
   * @returns {object} Returns the server response
   */
  async removeLike(user, comment) {
    await ArticleCommentLike.destroy({
      where: {
        userId: user.id,
        commentId: comment.id,
        articleId: comment.articleId,
      },
    });
    const updatedComment = await comment.decrement('totalLikes');
    return {
      totalLikes: updatedComment.totalLikes,
      liked: false,
    };
  }
}
export default ArticleCommentLikeController;

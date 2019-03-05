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
   * @method promiseError
   * @param {string} responseHandler method name of response object
   * @param {*} message data to send back to client
   * @returns {object} error
   */
  promiseError(responseHandler, message) {
    return {
      responseHandler, message,
    };
  }

  /**
   * @method likeToggle
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined} nothing
   */
  likeToggle(req, res) {
    const { user } = req;

    // Find article by slug.
    Article
      .findOne({
        where: {
          slug: req.params.slug,
        },
      })
      .then((article) => {
        // Does article exists?
        if (!article) {
          throw this.promiseError('notFound', 'Article does not exists');
        } else {
          return article;
        }
      })
      .then(article => (ArticleComment.findOne({ // Get comment by article id and comment id.
        where: {
          id: req.params.id,
          articleId: article.id,
        },
      })
      ))
      .then((comment) => {
        // Does comment exists?
        if (!comment) {
          throw this.promiseError('notFound', 'Comment does not exists');
        } else {
          return comment;
        }
      })
      .then(comment => this.getUserLikeRecord(user, comment)) // Get user like record
      .then((record) => {
        // Has user liked before?
        if (record.commentLike) {
          return this.removeLike(user, record.comment);
        }
        return this.addLike(user, record.comment);
      })
      .then(result => response(res).success(result)) // Send response
      .catch((e) => {
        if (e.responseHandler) {
          response(res)[e.responseHandler](e.message);
        } else {
          response(res).serverError('Internal server error');
        }
      });
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
    })
      .then(record => ({
        comment,
        commentLike: record,
      }));
  }

  /**
   * @param {*} user The user object
   * @param {*} comment The comment record
   * @returns {Promise} Returns a promise to add the user's like
   */
  addLike(user, comment) {
    return ArticleCommentLike.create({
      userId: user.id,
      articleId: comment.articleId,
      commentId: comment.id,
    })
      .then(() => comment.increment('totalLikes'))
      .then(updatedComment => ({
        totalLikes: updatedComment.totalLikes,
        liked: true,
      }));
  }

  /**
   * @param {*} user The user object
   * @param {*} comment The comment record
   * @returns {Promise} Returns a promise to remove the user's like
   */
  removeLike(user, comment) {
    return ArticleCommentLike.destroy({
      where: {
        userId: user.id,
        commentId: comment.id,
        articleId: comment.articleId,
      },
    })
      .then(() => comment.decrement('totalLikes'))
      .then(updatedComment => ({
        totalLikes: updatedComment.totalLikes,
        liked: false,
      }));
  }
}
export default ArticleCommentLikeController;

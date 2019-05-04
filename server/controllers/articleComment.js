import models from '../database/models';
import response from '../utils/response';
import { favouriteArticleNotification, HelperUtils } from '../utils';

const {
  ArticleComment,
  Bookmark,
  User,
  Notification,
  UserNotification,
  CommentEditHistory,
  ArticleCommentLike
} = models;

/**
 * @class ArticleComment
 * @description Controller to handle comment request
 * @exports ArticleComment
 */
class Comment {
  /**
   * @method getComments
   * @description - Gets all comments for a single article
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The comment object
   */
  static async getComments(req, res) {
    const { user, article } = req;
    const articleId = article.id;
    let comments = await ArticleComment.findAll({
      where: {
        articleId
      },
      order: [['id', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['firstname', 'lastname', 'username', 'email', 'image']
        }
      ]
    });
    if (user.id) {
      comments = await Promise.all(comments.map(async (comment) => {
        const userLike = await ArticleCommentLike.findOne({
          where: {
            userId: user.id,
            commentId: comment.dataValues.id,
            articleId: comment.dataValues.articleId
          }
        });
        return {
          ...comment.dataValues,
          hasLiked: Boolean(userLike)
        };
      }));
    }
    return response(res).success({
      message: 'Comments successfully retrieved',
      comments
    });
  }

  /**
   * @method postComment
   * @description - Posts comment to the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The comment object
   */
  static async postComment(req, res) {
    const userId = req.user.id;
    const { firstname, lastname } = req.user;
    const { comment } = req.body;
    const { slug } = req.params;
    const { article } = req;

    try {
      const articleId = article.id;
      const userComment = await ArticleComment.create({ articleId, comment, userId });

      response(res).created({
        message: 'Comment created successfully',
        userComment
      });

      await CommentEditHistory.create({
        commentId: userComment.id,
        previousComment: comment
      });

      const bookmarks = await Bookmark.findAll({
        where: { articleId }
      }).map(user => user.userId);

      bookmarks.forEach(async (usersId) => {
        const userData = await User.findOne({
          attributes: ['id', 'email', 'username', 'emailNotification', 'inAppNotification'],
          where: { id: usersId }
        });

        if (userData.emailNotification && (userData.id !== req.user.id)) {
          await HelperUtils.sendMail(userData.email,
            'Authors Haven <notification@authorshaven.com>',
            'Bookmarked Article Notification',
            'Comment Notification',
            favouriteArticleNotification(userData.username, slug));
        }
        if (userData.inAppNotification && (userData.id === req.user.id)) {
          await HelperUtils.pusher(`channel-${userData.id}`, 'notification', {
            message: `${firstname} ${lastname} commented on a post you bookmarked`,
            title: article.title,
            type: 'comment',
            url: `/${slug}`
          });
          const notification = await Notification.create({
            message: `${firstname} ${lastname}  commented on a post you bookmarked`,
            metaId: article.id,
            type: 'comment',
            title: article.title,
            url: `/${slug}`
          });

          await UserNotification.create({
            userId: userData.id,
            notificationId: notification.dataValues.id
          });
        }
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
   * @returns {object} - The updated comment object
   */
  static async updateComment(req, res) {
    const { commentRow } = req;
    const { comment } = req.body;
    const { id } = commentRow; // commentId

    try {
      const previousComment = await ArticleComment.findOne({
        where: { id }
      });

      if (previousComment) {
        await CommentEditHistory.create({
          commentId: id,
          previousComment: previousComment.comment
        });
      }

      const articleUpdate = await ArticleComment.update({ comment },
        {
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
   * @returns {object} - response message
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
      return response(res).serverError({
        errors: { server: ['database error'] }
      });
    }
  }

  /**
   * @description highlights and comments on an article
   * @param {*} req
   * @param {*} res
   * @returns {object} highlighted string and comment
   */
  static async highlight(req, res) {
    const userId = req.user.id;
    const { highlighted, index, comment } = req.body;
    const { body } = req.article;
    const articleId = req.article.id;
    try {
      const valid = index === body.indexOf(highlighted);
      if (valid !== true) return response(res).badRequest({ message: 'invalid highlight' });

      const userComment = await ArticleComment.create({
        articleId,
        comment,
        highlighted,
        index,
        userId
      });
      return response(res).created({
        message: 'Comment created successfully',
        userComment
      });
    } catch (error) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }

  /**
   * @description returns edit history of a particular comment.
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns {undefined}
   */
  static async getEditHistory(req, res) {
    const { commentId } = req.params;
    const { article } = req;

    const comment = await ArticleComment.findOne({
      where: {
        articleId: article.id, // This ensures the comment belongs to the specified article
        id: commentId
      },
      attributes: ['userId', 'comment', 'createdAt']
    });
    if (!comment) {
      return response(res).notFound('Comment does not exists');
    }

    const { user } = req;
    // If user is not an admin AND is also not the persone that created the comment.
    if (user.id !== comment.userId && !user.isAdmin) {
      return response(res).unauthorized("You don't have permission to view this");
    }
    comment.userId = undefined; // user ID should not show in response.

    // Get comment history
    const dbHistory = await CommentEditHistory.findAll({
      where: {
        commentId
      },
      attributes: [['previousComment', 'comment'], 'createdAt'],
      order: [['id', 'DESC']]
    });

    let original, history;
    if (dbHistory.length === 0) {
      original = comment;
      history = [];
    } else {
      original = dbHistory.pop();
      history = dbHistory;
      history.unshift(comment);
    }
    response(res).success({
      original,
      history
    });
  }
}

export default Comment;

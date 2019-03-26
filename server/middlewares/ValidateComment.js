import { check, validationResult } from 'express-validator/check';
import { response } from '../utils';
import models from '../database/models';

const { ArticleComment, Article } = models;

/**
 * @class ValidateComment
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateComment {
  /**
     * @method validateMethods
     * @description Validates registration details provided by user
     * @param {string} requestType - The request type being sent
     * @param {boolean} commentId - Boolean to check if comment id is specified
     * @returns {array} - Array of validation methods
     */
  static validateMethods(requestType, commentId) {
    const propsToValidate = [];

    if (requestType === 'update' || requestType === 'create') {
      propsToValidate.push([check('comment')
        .exists()
        .withMessage('Comment field must be specified.')
        .isLength({ min: 1 })
        .withMessage('Comment must not be empty.')]);
    }

    if (commentId) {
      propsToValidate.push([
        check('commentId')
          .exists()
          .withMessage('Comment ID must be specified.')
          .isInt()
          .withMessage('Comment ID must be an integer.')
      ]);
    }

    return propsToValidate;
  }

  /**
   * @method validateUserDetails
   * @description Validates registration details provided by user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async validateComment(req, res, next) {
    const { commentId, slug } = req.params;
    const errorFormatter = ({ msg }) => [msg];
    const errorMessages = validationResult(req).formatWith(errorFormatter);

    if (!errorMessages.isEmpty()) {
      return response(res).badRequest({ errors: errorMessages.mapped() });
    }

    if (commentId) {
      const commentRow = await ValidateComment.verifyComment(commentId, res);
      if (!commentRow || slug !== commentRow['Article.slug']) {
        return response(res).notFound({ errors: { comment: ['Comment not found.'] } });
      }

      if (commentRow.userId !== req.user.id) {
        return response(res).forbidden({
          errors: {
            comment: ['You are not permitted to make changes to this article']
          }
        });
      }
      req.commentRow = commentRow;
    }
    next();
  }

  /**
   * @method verifyComment
   * @param {integer} commentId - The comment ID
   * @param {object} res - The response object
   * @returns {Promise} Article Comment Promise
   */
  static async verifyComment(commentId, res) {
    try {
      const commentRow = await ArticleComment.findOne({
        include: [{
          model: Article,
          attributes: ['slug']
        }],
        where: {
          id: commentId
        },
        raw: true
      });
      return commentRow;
    } catch (error) {
      return response(res).serverError({
        errors: { server: ['database error'] }
      });
    }
  }
}

export default ValidateComment;

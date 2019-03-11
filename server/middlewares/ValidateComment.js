import { check, validationResult } from 'express-validator/check';
import { response } from '../utils';
import models from '../database/models';

const { ArticleComment } = models;

/**
 * @class ValidateComment
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateComment {
  /**
   * @method validateMethods
   * @description Validates registration details provided by user
   * @param {object} commentId - Boolean to check if comment id is specified
   * @returns {array} - Array of validation methods
   */
  static validateMethods(commentId = false) {
    const propsToValidate = [
      check('comment')
        .exists()
        .withMessage('Comment field must be specified.')
        .isLength({ min: 1 })
        .withMessage('Comment must not be empty.')
    ];

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
    const { commentId } = req.params;
    const errorFormatter = ({ msg }) => [msg];
    const errorMessages = validationResult(req).formatWith(errorFormatter);

    if (!errorMessages.isEmpty()) {
      return response(res).badRequest({ errors: errorMessages.mapped() });
    }

    try {
      const commentRow = await ArticleComment.findOne({
        where: {
          id: commentId
        },
        raw: true
      });
      if (commentId && !commentRow) {
        return response(res).notFound({
          errors: { comment: ['Comment not found.'] }
        });
      }
      req.commentRow = commentRow;
      return next();
    } catch (error) {
      return response(res).serverError({
        errors: { server: ['database error'] }
      });
    }
  }
}

export default ValidateComment;

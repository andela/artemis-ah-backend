import { check, validationResult } from 'express-validator/check';
import { response } from '../utils';

/**
 * @class ValidateComment
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateComment {
  /**
     * @method validateMethods
     * @description Validates registration details provided by user
     * @returns {array} - Array of validation methods
     */
  static validateMethods() {
    return [
      check('comment')
        .exists()
        .withMessage('Comment field must be specified.')
        .isLength({ min: 1 })
        .withMessage('Comment must not be empty.')
    ];
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
    const errorFormatter = ({ msg }) => [msg];
    const errorMessages = validationResult(req).formatWith(errorFormatter);

    if (!errorMessages.isEmpty()) {
      return response(res).badRequest({ errors: errorMessages.mapped() });
    }

    return next();
  }
}

export default ValidateComment;

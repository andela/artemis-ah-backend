import { check, validationResult } from 'express-validator/check';
import { response, validationErrors } from '../utils';

/**
 * @class ValidatePasswordReset
 * @description class that contains method to validate user input for reset password
 * @exports ValidatePasswordReset
 * @returns {undefined}
 */
class ValidatePasswordReset {
  /**
   * @method checkResetPassword
   * @description Validates users password length
   * @returns {object} return an array of errors
   */
  static checkResetPassword() {
    return [
      check('newPassword')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('new password field is required')
        .isLength({ min: 8 })
        .withMessage('minimum character length for new password should be 8')
        .isAlphanumeric('en-GB')
        .withMessage('new password must be Alphanumeric.'),

      check('confirmPassword')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('comfirm password field is required')
    ];
  }

  /**
   * @method checkForErrors
   * @description check if error exists
   * @param {object} req - request object
   * @param {object} res - response body
   * @param {function} next - callback function
   * @returns {undefined}
   */
  static checkForErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res).badRequest({
        errors: validationErrors(errors)
      });
    }
    next();
  }
}

export default ValidatePasswordReset;

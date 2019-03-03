import { check, validationResult } from 'express-validator/check';
import Sequelize from 'sequelize';
import models from '../database/models';
import response from '../utils/response';

const { Op } = Sequelize;
const { User } = models;

/**
 * @class ValidateUser
 * @description Validates user registration details
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   * @method validateMethods
   * @description Validates registration details provided by user
   * @returns {array} - Array of validation methods
   */
  static validateMethods() {
    return [
      check('email')
        .exists()
        .withMessage('Email field cannot be blank.')
        .isEmail()
        .withMessage('Email is invalid.'),

      check('password')
        .optional()
        .isAlphanumeric('en-GB')
        .withMessage('Password must be Alphanumeric.')
        .isLength({ min: 8 })
        .withMessage('Password cannot be less than 8 characters.')
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
  static validateUserDetails(req, res, next) {
    const { username, email } = req.body;
    const errorFormatter = ({ msg }) => [msg];
    const errorMessages = validationResult(req).formatWith(errorFormatter);

    if (!errorMessages.isEmpty()) {
      return response(res).badRequest({ errors: errorMessages.mapped() });
    }

    const uniqueUser = ValidateUser.isUserUnique(email, username);
    return Promise.resolve(uniqueUser).then((result) => {
      if (result.length > 0) {
        const errors = {};
        result.map((userDetail) => {
          errors[userDetail] = [`${userDetail} already exists.`];
        });
        return response(res).conflict({ errors });
      }
      return next();
    });
  }

  /**
   * @method isUserUnique
   * @description Validates if user is unique
   * @param {string} email - User's email
   * @param {string} username - User's username
   * @returns {boolean} - If user detail is unique or not
   */
  static async isUserUnique(email, username) {
    const user = await User.findAll({
      attributes: ['email', 'username'],
      where: {
        [Op.or]: [{ email }, { username }]
      },
      raw: true
    });

    const existingUserObject = await user;
    return user.length > 0 ? Object.keys(existingUserObject[0]) : [];
  }
}

export default ValidateUser;

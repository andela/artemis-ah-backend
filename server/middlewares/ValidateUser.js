import { check, validationResult } from 'express-validator/check';
import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import models from '../database/models';
import { response, validationErrors, HelperUtils } from '../utils';

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
        .exists()
        .withMessage('Password field cannot be blank.')
        .isAlphanumeric('en-GB')
        .withMessage('Password must be Alphanumeric.')
        .isLength({ min: 8 })
        .withMessage('Password cannot be less than 8 characters.'),

      check('firstname')
        .exists()
        .withMessage('First name field must be specified.')
        .isLength({ min: 1 })
        .withMessage('First name must contain at least 1 character.')
        .isAlpha()
        .withMessage('First name can only contain alphabetic characters.'),

      check('lastname')
        .exists()
        .withMessage('Last name field must be specified.')
        .isLength({ min: 1 })
        .withMessage('Last name must contain at least 1 character.')
        .isAlpha()
        .withMessage('Last name can only contain alphabetic characters.'),

      check('username')
        .exists()
        .withMessage('Username field must be specified.')
        .isAlphanumeric()
        .withMessage('Username can only contain alphabetic characters')
        .isLength({ min: 2 })
        .withMessage('Username must not be less than 2 characters.')
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
  static async validateUserDetails(req, res, next) {
    const { username, email } = req.body;
    const errorFormatter = ({ msg }) => [msg];
    const errorMessages = validationResult(req).formatWith(errorFormatter);

    if (!errorMessages.isEmpty()) {
      return response(res).badRequest({ errors: errorMessages.mapped() });
    }
    const userObj = await ValidateUser.isUserUnique(email, username);

    if (userObj.length > 0) {
      const errors = {};
      userObj.forEach((field) => {
        errors[field] = [`${field} already exists.`];
      });
      return response(res).conflict({ errors });
    }
    next();
  }

  /**
   * @method isUserUnique
   * @description Validates if user is unique
   * @param {string} email - User's email
   * @param {string} username - User's username
   * @returns {boolean} - If user detail is unique or not
   */
  static async isUserUnique(email, username) {
    const matchedFields = [];
    const userObj = await User.findOne({
      attributes: ['email', 'username'],
      where: {
        [Op.or]: [{ email }, { username }]
      },
      raw: true
    });

    if (userObj && userObj.email === email) {
      matchedFields.push('email');
    }

    if (userObj && userObj.username === username) {
      matchedFields.push('username');
    }

    return matchedFields;
  }

  /**
   * @method validateLoginFields
   * @description Validates details provided by user when logging in
   * @returns {array} - Array of validation methods
   */
  static validateLoginFields() {
    return [
      check('name')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('Email or Username is required to login'),

      check('password')
        .exists({
          checkNull: true,
          checkFalsy: true
        })
        .withMessage('Password is required to login')
    ];
  }

  /**
   * @method validateLogin
   * @description Validates details provided by user when logging in
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - function to pass to next middleware
   * @returns {undefined}
   */
  static async validateLogin(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res).badRequest({
        errors: validationErrors(errors)
      });
    }
    const { name, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: name }, { username: name }]
      }
    });
    if (!user) {
      return response(res).notFound({
        message: 'invalid credentials'
      });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return response(res).forbidden({
        message: 'invalid credentials'
      });
    }
    if (!user.verifiedEmail) {
      return response(res).forbidden({
        message: 'You have to verify your email before you login'
      });
    }
    req.user = user;
    next();
  }

  /**
   * @method validateUserDeactivation
   * @description Validates details provided by user when deactivating
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - function to pass to next middleware
   * @returns {undefined}
   */
  static async validateUserDeactivation(req, res, next) {
    const { password } = req.body;
    const { user } = req;

    if (!password) {
      return response(res).badRequest({ message: 'Password is required for deactivation' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return response(res).forbidden({ message: 'Password is invalid' });
    }

    next();
  }

  /**
   * @method validateEmail
   * @description Validate email format
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - function to pass to next middleware
   * @returns {undefined}
   */
  static async validateEmail(req, res, next) {
    const { email } = req.body;

    if (!HelperUtils.isValidEmail(email)) {
      response(res).badRequest({ message: 'invalid email format' });
    } else {
      next();
    }
  }
}

export default ValidateUser;

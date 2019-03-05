import '@babel/polyfill';
import dotenv from 'dotenv';
import db from '../database/models';
import { HelperUtils, response } from '../utils';
import verifyEmailMarkup from '../utils/markups/emailVerificationMarkup';
import passwordResetMarkup from '../utils/markups/passwordResetMarkup';

const { User } = db;
dotenv.config();

/**
 * @description Controller to authenticate users
 * @return {undefined}
 */
export default class Users {
  /**
   * @description controller function that handles the creation of a User
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async signupUser(req, res) {
    const {
      firstname, lastname, username, email, password
    } = req.body;
    const { body } = req;

    const hash = await HelperUtils.hashPassword(password);
    const hashedEmail = await HelperUtils.hashPassword(email);

    const formInputs = { ...body, password: hash };
    try {
      const createUser = await User.create(formInputs);
      const token = HelperUtils.generateToken({
        ...formInputs,
        id: createUser.id
      });
      const name = typeof username !== 'undefined'
        ? username
        : `${lastname}, ${firstname}`;
      HelperUtils.sendMail(email,
        'Authors Haven <no-reply@authorshaven.com>',
        'Email Verification',
        'Verify Email',
        verifyEmailMarkup(name, email, hashedEmail));

      response(res).created({
        message: 'user created successfully',
        user: {
          email,
          token,
          username,
          bio: createUser.bio,
          image: createUser.image
        }
      });
    } catch (err) {
      response(res).sendData(500, err);
    }
  }

  /**
   * @description This controller method completes the email verification process
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async verifyUserEmail(req, res) {
    const { email, hash } = req.query;

    const isEmail = await HelperUtils.comparePasswordOrEmail(email, hash);

    if (isEmail) {
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        response(res).notFound({
          message: 'user doesn\'t exist',
        });
      } else {
        await user.update({
          verifiedEmail: true
        });
        response(res).success({
          message: 'email verified successfully'
        });
      }
    } else {
      response(res).badRequest({ message: 'invalid email' });
    }
  }

  /**
   * @description This controller method sends password reset link e-mail
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @returns {object} Json response
   */
  static async resetPasswordEmail(req, res) {
    const { email } = req.body;

    const hashedEmail = HelperUtils.hashPassword(email);

    try {
      const user = await User.findOne({
        where: { email }
      });

      if (user === null) {
        response(res).notFound({
          message: 'user not found in our records'
        });
      } else {
        HelperUtils.sendMail(email,
          'Authors Haven <no-reply@authorshaven.com>',
          'Password Reset',
          'Reset Password',
          passwordResetMarkup(user.firstname, email, hashedEmail));
        response(res).success({
          message: 'Please, verify password reset link in your email box'
        });
      }
    } catch (err) {
      response(res).sendData(500, {
        message: err
      });
    }
  }

  /**
   * @description This controller method resets user password
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} Json response
   */
  static async resetPassword(req, res) {
    const { newPassword, confirmPassword } = req.body;
    const isPassword = newPassword === confirmPassword;

    if (!isPassword) {
      return response(res).sendData(400, {
        message: 'The supplied passwords do not match'
      });
    }

    try {
      const hashPassword = HelperUtils.hashPassword(newPassword);

      const { email, hash } = req.query;
      const isEmail = await HelperUtils.comparePasswordOrEmail(email, hash);

      if (isEmail) {
        const user = await User.findOne({
          where: { email }
        });

        if (!user) {
          response(res).notFound({
            message: 'User not found'
          });
        } else {
          await user.update({
            password: hashPassword
          });
          response(res).success({
            message:
              'Password reset successful. Please, login using your new password.'
          });
        }
      } else {
        response(res).sendData(400, {
          message: 'Invalid password reset link'
        });
      }
    } catch (err) {
      response(res).sendData(500, {
        message: err
      });
    }
  }

  /**
   * @description This controller method completes the social sign in process
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async socialLogin(req, res) {
    const { data } = req.user;

    try {
      const userToken = await HelperUtils.generateToken(data);

      const {
        email, username, bio, image
      } = data;

      response(res).success({
        message: 'user logged in successfully',
        user: {
          email,
          username,
          bio,
          image,
          token: userToken
        }
      });
    } catch (err) {
      response(res).serverError({
        message: 'token could not be generated, please try again later'
      });
    }
  }

  /**
   * @description controller function that handles user data retrieval
   * @param {*} req
   * @param {*} res
   * @returns {object} user
   */
  static async getUser(req, res) {
    const { username } = req.params.username ? req.params : req.user;

    try {
      const user = await User.findOne({
        where: { username },
        attributes: ['username', 'email', 'bio', 'image']
      });

      if (!user) response(res).notFound({ message: 'user not found' });
      else {
        response(res).success({
          message: 'user found',
          user
        });
      }
    } catch (err) {
      response(res).serverError({ message: err });
    }
  }

  /**
   * @description contoller function that updates user information
   * @param {*} req
   * @param {*} res
   * @returns {object} updatedUser
   */
  static async updateUser(req, res) {
    const { username } = req.user;
    try {
      const user = await User.findOne({
        where: { username },
        attributes: ['username', 'email', 'bio', 'image']
      });

      if (!user) response(res).notFound({ message: 'user not found' });
      else {
        const values = {
          bio: req.body.bio || user.bio,
          image: req.body.image || user.image,
        };

        const updateUser = await User.update(values, { returning: true, where: { username } });
        const { email, bio, image } = updateUser[1][0];

        response(res).success({
          message: 'user updated',
          user: {
            username,
            email,
            bio,
            image,
          }
        });
      }
    } catch (err) {
      response(res).serverError({ message: err });
    }
  }
}

/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import db from '../database/models';
import { HelperUtils } from '../utils';
import response from '../utils/response';
import verifyEmailMarkup from '../utils/markups/emailVerificationMarkup';
import '@babel/polyfill';

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

    const hash = HelperUtils.hashPassword(password);
    const hashedEmail = HelperUtils.hashPassword(email);

    const formInputs = {
      firstname, lastname, username, email, password: hash
    };
    try {
      const createUser = await User.create(formInputs);
      const token = HelperUtils.generateToken(formInputs);
      const name = typeof username !== 'undefined' ? username : `${lastname}, ${firstname}`;
      HelperUtils.sendMail(
        email,
        'Authors Haven <no-reply@authorshaven.com>',
        'Email Verification',
        'Verify Email',
        verifyEmailMarkup(name, email, hashedEmail)
      );

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
      res.status(400).json({ message: err });
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
        res.status(404).json({
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
      res.status(400).json({ message: 'invalid email' });
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
        token: userToken,
      }
    });
  }
}

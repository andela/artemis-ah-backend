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
    const { body } = req;

    const hash = await HelperUtils.hashPassword(password);
    const hashedEmail = await HelperUtils.hashPassword(email);

    const formInputs = { ...body, password: hash };
    try {
      const createUser = await User.create(formInputs);
      const encryptDetails = {
        id: createUser.id, firstname, lastname, username, email
      };
      const token = await HelperUtils.generateToken(encryptDetails);
      const name = typeof username !== 'undefined' ? username : `${lastname}, ${firstname}`;

      await HelperUtils.sendMail(
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
}

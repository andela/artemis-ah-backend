/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { User } from '../database/models';
import { HelperUtils } from '../utils';
import response from '../utils/response';
import verifyEmailMarkup from '../utils/markups/emailVerificationMarkup';

dotenv.config();

/**
 * @description Controller to authenticate users
 * @return {undefined}
 */
export default class authUser {
  /**
   * @description controller function that handles the creation of a User
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static signupUser(req, res) {
    const {
      firstname, lastname, username, email, password
    } = req.body;

    const hash = HelperUtils.hashPassword(password);
    const hashedEmail = HelperUtils.hashPassword(email);

    const formInputs = {
      firstname, lastname, username, email, password: hash
    };

    User.create(formInputs)
      .then((userData) => {
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
            bio: userData.bio,
            image: userData.image
          }
        });
      })
      .catch(error => res.status(400).json({
        error
      }));
  }

  /**
   * @description This controller method completes the email verification process
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static verifyUserEmail(req, res) {
    const { email, hash } = req.query;

    const isEmail = HelperUtils.comparePasswordOrEmail(email, hash);

    if (isEmail) {
      User.findOne({
        where: { email }
      })
        .then((user) => {
          if (!user) {
            res.status(404).json({
              message: 'user doesn\'t exist',
            });
          } else {
            user.update({
              verifiedEmail: true
            })
              .then(() => response(res).success({
                message: 'email verified successfully'
              }))
              .catch(error => res.status(400).json({ message: error }));
          }
        })
        .catch(error => res.status(400).json({ message: error }));
    } else {
      res.status(400).json({ message: 'invalid email' });
    }
  }
}

import db from '../database/models';
import { response, HelperUtils } from '../utils';

const { User } = db;

/**
 * @class AuthenticateUser
 * @description Authenticates a given user
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method verifyAuthHeader
   * @description Verifies that the authorization was set
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static async verifyAuthHeader(req) {
    const { authorization } = req.headers;
    if (!authorization) {
      return { error: 'auth' };
    }

    const token = authorization.split(' ')[1];
    const payload = HelperUtils.verifyToken(token);
    try {
      const { id, username, email } = payload;
      const user = await User.findOne({ where: { id, username, email } });
      if (!user) {
        return { error: 'token' };
      }
      return user;
    } catch (err) {
      return { error: 'Error communicating with DB' };
    }
  }

  /**
   * @method verifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async verifyUser(req, res, next) {
    const payload = await AuthenticateUser.verifyAuthHeader(req);
    let error;

    if (payload.error === 'auth') {
      error = 'No authorization header was specified.';
    } else if (payload.error === 'token') {
      error = 'The provided token is invalid';
    }

    if (payload.error) {
      return response(res).unauthorized({ error: { token: [error] } });
    }

    req.user = payload;
    return next();
  }

  /**
   * @method identifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async identifyUser(req, res, next) {
    const payload = await AuthenticateUser.verifyAuthHeader(req);
    if (!payload.error) {
      req.user = payload;
    }

    return next();
  }
}

export default AuthenticateUser;

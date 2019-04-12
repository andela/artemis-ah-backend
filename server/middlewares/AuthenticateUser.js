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
   * @method isAdmin
   * @description Verifies that logged user is admin
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static isAdmin(req, res, next) {
    if (!req.user.isAdmin) {
      return response(res).unauthorized({
        message: 'You are Unauthorized to access this page'
      });
    }
    return next();
  }

  /**
   * @method identifyUser
   * @description Identifies logged in users
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async identifyUser(req, res, next) {
    const payload = await AuthenticateUser.verifyAuthHeader(req);
    req.user = payload.error || !payload.active ? {} : payload;
    return next();
  }

  /**
   * @method verifyUsername
   * @description verifies a username passed in the route
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async verifyUsername(req, res, next) {
    const { username } = req.params;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user || !user.active) {
        return response(res).notFound({ message: `User with username ${username} does not exist` });
      }
      req.otherUser = user;
      return next();
    } catch (err) {
      return response(res).serverError({ message: 'Could not validate username' });
    }
  }

  /**
   * @method verifySuperAdmin
   * @description verifies a user is a superadmin
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static async verifySuperAdmin(req, res, next) {
    const { role } = req.user;
    return role === 'superadmin' ? next() : response(res).forbidden({ message: 'Only a super admin can access this route' });
  }

  /**
   * @method verifyActiveUser
   * @description Verifies that the user is still active
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {undefined}
   */
  static async verifyActiveUser(req, res, next) {
    const user = req.user.data ? req.user.data : req.user;
    if (!user.active) {
      return response(res).unauthorized({ message: 'Your account is inactive' });
    }
    return next();
  }

  /**
   * @method verifySocialLogin
   * @description Verifies that the user granted the platform access to their data
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {undefined}
   */
  static async verifySocialLogin(req, res, next) {
    const { query } = req;
    const { error, denied } = query;
    if (error || denied) {
      const encryptedData = await HelperUtils.generateToken('Error receiving data');
      return res.redirect(301,
        `${process.env.SOCIAL_LOGIN_REDIRECT_URL}?errorData=${encryptedData}`);
    }
    return next();
  }
}

export default AuthenticateUser;

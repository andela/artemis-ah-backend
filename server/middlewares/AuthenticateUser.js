import { response, HelperUtils } from '../utils';

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
  static verifyAuthHeader(req) {
    const { authorization } = req.headers;
    if (!authorization) {
      return { error: 'auth' };
    }

    const token = authorization.split(' ')[1];
    const payload = HelperUtils.verifyToken(token);

    if (!payload) {
      return { error: 'token' };
    }

    return payload;
  }

  /**
   * @method verifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static verifyUser(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;

    if (payload.error === 'auth') {
      error = 'No authorization header was specified.';
    } else if (payload.error === 'token') {
      error = 'The provided token is invalid.';
    }

    if (payload.error) {
      return response(res).unauthorized({ error: { token: [error] } });
    }

    req.user = payload;
    return next();
  }
}

export default AuthenticateUser;

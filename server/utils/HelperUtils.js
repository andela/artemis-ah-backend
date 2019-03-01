import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

/**
 * @class HelperUtils
 * @description Specifies reusable helper methods
 * @exports HelperUtils
 */
class HelperUtils {
  /**
   * @method generateToken
   * @description Generate a token from a given payload
   * @param {object} payload The user payload to tokenize
   * @returns {string} JSON Web Token
   */
  static generateToken(payload) {
    return jwt.sign(payload, secretKey);
  }

  /**
   * @method verifyToken
   * @description Verifies a token and decodes it to its subsequent payload
   * @param {string} token The token to decode
   * @returns {object} The resulting payload
   */
  static verifyToken(token) {
    try {
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (error) {
      return false;
    }
  }
}

export default HelperUtils;

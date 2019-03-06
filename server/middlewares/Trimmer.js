/**
 * @class Trimmer
 * @description Trims data
 * @exports AuthenticateUser
 */
class Trimmer {
  /**
   * @method trimValues
   * @description Takes in an object and returns it with all the values trimmed
   * @param {object} data - The object to be trimmed
   * @returns {object} - trimmed data
   */
  static trimValues(data) {
    const dataKeys = Object.keys(data);
    const trimmedData = {};
    for (let i = 0; i < dataKeys.length; i += 1) {
      const value = data[dataKeys[i]];
      trimmedData[dataKeys[i]] = typeof value === 'string' ? value.trim() : value;
    }
    return trimmedData;
  }

  /**
   * @method trimBody
   * @description Trims the request body
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {undefined} -
   */
  static trimBody(req, res, next) {
    if (req.body) {
      req.body = Trimmer.trimValues(req.body);
    }
    return next();
  }
}

export default Trimmer;

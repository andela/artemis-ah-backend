import { response } from '../utils';

/**
 * @class ValidateReport
 * @description Validates user reports on articles
 * @exports ValidateReport
 */
class ValidateReport {
  /**
   * @method isInt
   * @description Verifies if the reportId is an Integer
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static isInt(req, res, next) {
    const { id } = req.params;
    const reportId = Number.isInteger(Number(id));

    if (!reportId) {
      return response(res).notFound({
        message: 'You have entered an invalid parameter'
      });
    }

    return next();
  }

  /**
   * @method reportCategory
   * @description Verifies if the reportCategory is correct
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static reportCategory(req, res, next) {
    const reportCategory = ['Plagiarism', 'Copyright', 'Pornographic'];
    const { category } = req.body;

    if (category === '' || reportCategory.indexOf(category) < 0) {
      return response(res).notFound({
        message: 'Category can either be Plagiarism, Copyright, or Pornographic'
      });
    }

    return next();
  }

  /**
   * @method report
   * @description Verifies if report has no content
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static report(req, res, next) {
    const { report } = req.body;

    if (report === '') {
      return response(res).notFound({
        message: 'Please enter a report'
      });
    }

    return next();
  }

  /**
   * @method status
   * @description Checks if status is Resolved or Unresolved
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @param {callback} next - Callback method
   * @returns {object} - JSON response object
   */
  static status(req, res, next) {
    const statusValue = ['Resolved', 'Unresolved'];
    const { status } = req.body;

    if (status === '' || statusValue.indexOf(status) < 0) {
      return response(res).notFound({
        message: 'Status can either be Resolved or Unresolved'
      });
    }

    return next();
  }
}

export default ValidateReport;

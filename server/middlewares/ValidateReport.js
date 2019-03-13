import { response } from '../utils';
import models from '../database/models';

const { Report } = models;

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
  static async validateId(req, res, next) {
    const { id } = req.params;
    const reportId = Number.isInteger(Number(id));

    if (!reportId) {
      return response(res).badRequest({
        message: 'Report ID must be an integer.'
      });
    }

    try {
      const report = await Report.findOne({
        where: {
          id
        }
      });

      if (!report) {
        return response(res).notFound({
          message: 'Report not found'
        });
      }
      req.report = report;
    } catch (error) {
      return response(res).serverError({
        error: ['database error']
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
    const reportCategory = ['plagiarism', 'inappropriate', 'abusive'];
    const selectedCategory = req.body.category || req.params.category;
    const category = selectedCategory.toLocaleLowerCase();

    if (!selectedCategory || !reportCategory.includes(category)) {
      return response(res).badRequest({
        message: 'Category can either be Plagiarism, Inappropriate, or Abusive'
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
    const userId = req.user.id;
    const articleId = req.article.id;
    const articleUserId = req.article.userId;
    const { category } = req.body;

    if (report.trim() === '') {
      return response(res).notFound({
        message: 'Please enter a report'
      });
    }

    if (userId === articleUserId) {
      return response(res).forbidden({
        message: 'You can not report your own article',
      });
    }

    req.report = {
      userId, articleId, report, category
    };

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

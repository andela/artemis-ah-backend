import models from '../database/models';
import response from '../utils/response';

const { Report } = models;

/**
 * @class Reports
 * @description Controller to handle report request
 * @exports Reports
 */
class Reports {
  /**
   * @method postReport
   * @description - Posts report to the database
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} - The article object
   */
  static async postReport(req, res) {
    try {
      const reportArticle = await Report.create(req.report);
      response(res).created({
        message: 'Article reported successfully',
        reportArticle
      });
    } catch (error) {
      return response(res).serverError({
        error
      });
    }
  }

  /**
   * @description This controller method gets all reports
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} - All reports
   */
  static async fetchReports(req, res) {
    const category = req.query.category || false;
    const query = !category ? {} : { category };
    try {
      const reports = await Report.findAll({
        attributes: ['userId', 'articleId', 'report', 'category', 'status'],
        where: query
      });
      return response(res).success({
        reports
      });
    } catch (error) {
      return response(res).serverError({
        error
      });
    }
  }

  /**
   * @description This controller method gets a specific report
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} - Report
   */
  static async fetchReport(req, res) {
    const { report } = req;
    return response(res).success({
      report
    });
  }

  /**
   * @description This controller method gets a specific report
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} - Report
   */
  static async updateReport(req, res) {
    const { id, status } = req.report;

    try {
      const updateStatus = await Report.update({
        status
      },
      {
        where: {
          id
        }
      });
      response(res).success({
        message: 'Report status Updated',
        updateStatus
      });
    } catch (error) {
      return response(res).serverError({
        error
      });
    }
  }
}

export default Reports;

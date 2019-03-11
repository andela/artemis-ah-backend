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
    const userId = req.user.id;
    const articleId = req.article.id;
    const articleUserId = req.article.userId;
    const { report } = req.body;
    const { category } = req.body;

    try {
      if (userId === articleUserId) {
        return response(res).notFound({
          message: 'You can not report your own article',
        });
      }

      const reportArticle = await Report.create({
        userId, articleId, report, category
      });
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
    try {
      const reports = await Report.findAll({
        attributes: ['userId', 'articleId', 'report', 'category', 'status']
      });
      response(res).success({
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
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} - Report
   */
  static async fetchReport(req, res) {
    const { id } = req.params;

    try {
      const reports = await Report.findOne({
        where: {
          id
        }
      });

      if (reports) {
        response(res).success({
          reports
        });
      } else {
        response(res).notFound({
          message: 'Report not found'
        });
      }
    } catch (error) {
      return response(res).serverError({
        error
      });
    }
  }

  /**
   * @description This controller method gets a specific report
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} - Report
   */
  static async updateReport(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const report = await Report.findOne({
        where: {
          id
        }
      });

      if (report) {
        const updateStatus = await report.update({
          status
        });
        response(res).success({
          message: 'Report status Updated',
          updateStatus
        });
      } else {
        response(res).notFound({
          message: 'Report not found'
        });
      }
    } catch (error) {
      return response(res).serverError({
        error
      });
    }
  }
}

export default Reports;

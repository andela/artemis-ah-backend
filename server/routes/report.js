import express from 'express';
import { Report } from '../controllers';
import { AuthenticateUser, AuthenticateArticle, ValidateReport } from '../middlewares';

const reportRoutes = express.Router();

// Post a report
reportRoutes.post('/articles/:slug/report',
  AuthenticateUser.verifyUser,
  AuthenticateArticle.verifyArticle,
  ValidateReport.reportCategory,
  ValidateReport.report,
  Report.postReport);

// List all reports
reportRoutes.get('/admin/reports',
  AuthenticateUser.verifyUser,
  AuthenticateUser.isAdmin,
  Report.fetchReports);

// Get a single report by its id
reportRoutes.get('/admin/reports/:id',
  AuthenticateUser.verifyUser,
  AuthenticateUser.isAdmin,
  ValidateReport.validateId,
  Report.fetchReport);

// Update the status of a report
reportRoutes.patch('/admin/reports/:id/status',
  AuthenticateUser.verifyUser,
  AuthenticateUser.isAdmin,
  ValidateReport.validateId,
  ValidateReport.status,
  Report.updateReport);

export default reportRoutes;

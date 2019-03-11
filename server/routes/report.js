import express from 'express';
import { Report } from '../controllers';
import { AuthenticateUser, AuthenticateArticle, ValidateReport } from '../middlewares';

const reportRoutes = express.Router();

// Post a report
reportRoutes.post('/reports/:slug',
  AuthenticateUser.verifyUser, AuthenticateArticle.verifyArticle,
  ValidateReport.report, ValidateReport.reportCategory, Report.postReport);

// List all reports
reportRoutes.get('/reports',
  AuthenticateUser.verifyUser, AuthenticateUser.isAdmin, Report.fetchReports);

// Get a single report by its id
reportRoutes.get('/reports/:id',
  AuthenticateUser.verifyUser, AuthenticateUser.isAdmin, ValidateReport.isInt, Report.fetchReport);

// Update the status of a report
reportRoutes.patch('/reports/:id/status',
  AuthenticateUser.verifyUser, AuthenticateUser.isAdmin, ValidateReport.isInt,
  ValidateReport.status, Report.updateReport);

export default reportRoutes;

import express from 'express';
import { OfflineNotifications } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const notificationRoutes = express.Router();

// Get all offline comment notification for a user
notificationRoutes.get('/notifications/comment',
  AuthenticateUser.verifyUser,
  OfflineNotifications.commentNotifications);

export default notificationRoutes;

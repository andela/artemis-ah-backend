import express from 'express';
import { Notifications } from '../controllers';
import { AuthenticateUser } from '../middlewares';

const notificationRoutes = express.Router();

// Get all offline comment notification for a user
notificationRoutes.get('/notifications/comment',
  AuthenticateUser.verifyUser,
  Notifications.commentNotifications);

export default notificationRoutes;

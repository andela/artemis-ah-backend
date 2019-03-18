import express from 'express';
import { Notifications } from '../controllers';
import { AuthenticateUser } from '../middlewares';
import validateToggleNotification from '../validations/toggle-notification';

const notificationRoutes = express.Router();

// Get all offline comment notification for a user
notificationRoutes.get('/notifications/comment',
  AuthenticateUser.verifyUser,
  Notifications.fetchAllNotifications);


// Subscribe and unsubscribe notification for a user
notificationRoutes.patch('/users/notification',
  AuthenticateUser.verifyUser,
  validateToggleNotification,
  Notifications.toggleNotification);


export default notificationRoutes;

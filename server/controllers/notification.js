import { validationResult } from 'express-validator/check';
import db from '../database/models';
import response, { validationErrors } from '../utils/response';

const { UserNotification, Notification } = db;

/**
 * @description Controller to Notify users
 * @return {undefined}
 */
export default class Notifications {
  /**
   * @description controller method that handles get a specific users comment notification
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async commentNotifications(req, res) {
    const { id } = req.user;
    try {
      const notifications = await UserNotification.findAll({
        where: {
          userId: id,
          isRead: false,
          '$Notification.type$': 'comment'
        },
        include: [{
          model: Notification
        }]
      });
      return response(res).success({
        message: 'All comment notifications recieved',
        notifications: notifications.map(notify => notify.Notification)
      });
    } catch (err) {
      return response(res).sendData(500, err);
    }
  }

  /**
   * @description controller method that handles opting in and out of notifications
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async toggleNotification(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res).badRequest({
        errors: validationErrors(errors)
      });
    }

    const { inAppNotification, emailNotification } = req.body;
    try {
      await req.user.update({ inAppNotification, emailNotification });
      return response(res).success({ message: 'Notification settings updated' });
    } catch (err) {
      return response(res).serverError({ message: 'Could not update settings' });
    }
  }
}

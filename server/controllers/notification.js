import db from '../database/models';
import { response } from '../utils';

const { UserNotification, Notification } = db;

/**
 * @description Controller to authenticate users
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
      response(res).created({
        message: 'All comment notifications recieved',
        notifications
      });
    } catch (err) {
      return response(res).sendData(500, err);
    }
  }
}

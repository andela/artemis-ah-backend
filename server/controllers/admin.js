import { response } from '../utils';

/**
*@class Admin
*@description Controller for handling all the admin and super admin methods
*@exports Admin
*/
class Admin {
  /**
     * @method upgradeUser
     * @description Grants admin priviledges to a user
     * @param {*} req
     * @param {*} res
     * @returns {undefined}
     */
  static async upgradeUser(req, res) {
    const { otherUser } = req;
    const { isAdmin, username } = otherUser;
    try {
      if (isAdmin) {
        return response(res).badRequest({ message: `${username} is already an admin user` });
      }
      await otherUser.update({ isAdmin: true });
      return response(res).success({ message: `${username} has been granted admin priviledges` });
    } catch (err) {
      return response(res).serverError({ message: 'Could not update user' });
    }
  }

  /**
     * @method downgradeUser
     * @description Removes admin priviledges from a user
     * @param {*} req
     * @param {*} res
     * @returns {undefined}
     */
  static async downgradeUser(req, res) {
    const { otherUser } = req;
    const { isAdmin, username } = otherUser;
    try {
      if (!isAdmin) {
        return response(res).badRequest({ message: `${username} is not an admin user` });
      }
      await otherUser.update({ isAdmin: false });
      return response(res).success({ message: `${username} has been revoked of admin priviledges` });
    } catch (err) {
      return response(res).serverError({ message: 'Could not update user' });
    }
  }
}

export default Admin;

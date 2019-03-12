import Sequelize from 'sequelize';
import db from '../database/models';
import response from '../utils/response';

const { User, Follower } = db;

/**
 * @description Controller to authenticate users
 * @return {undefined}
 */
export default class Follow {
  /**
   * @description This controller method gets all users followers
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowers(req, res) {
    const { id } = req.user;
    try {
      const users = await Follower.findAll({
        where: { userId: id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['firstname', 'lastname', 'email', 'username', 'image']
          }
        ]
      });
      if (users.length < 1) {
        response(res).success({
          message: 'nobody is currently following you',
          followers: users
        });
      } else {
        response(res).success({
          message: 'these are your followers',
          followers: users.map(u => u.follower)
        });
      }
    } catch (err) {
      return response(res).serverError({ message: 'Could not get followers' });
    }
  }

  /**
   * @description This controller method gets all users you're following
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async fetchFollowing(req, res) {
    const { id } = req.user;
    try {
      const following = await Follower.findAll({
        where: { followerId: id },
        include: [
          {
            model: User,
            as: 'following',
            attributes: ['firstname', 'lastname', 'email', 'username', 'image']
          }
        ]
      });
      if (following.length < 1) {
        response(res).success({
          message: 'you are not following anyone',
          following
        });
      } else {
        response(res).success({
          message: 'people you are following',
          following: following.map(u => u.following)
        });
      }
    } catch (err) {
      return response(res).serverError({ message: 'Could not get following' });
    }
  }

  /**
   * @description This controller method handles follow a user
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async followUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      if (username === req.user.username) {
        response(res).forbidden({
          message: 'you cannot follow yourself'
        });
      } else {
        // Get user the current user wants to follow.
        const followee = await User.findOne({
          where: { username }
        });
        if (!followee) {
          return response(res).notFound(`User ${username} does not exists.`);
        }
        if (followee.id === id) {
          return response(res).forbidden('You can\'t follow yourself');
        }

        // Get follow record
        const followRecord = await Follower.findOne({
          where: {
            userId: followee.id,
            followerId: id
          }
        });
        // Is user currently following the person?
        if (!followRecord) {
          await Follower.create({
            userId: followee.id, // ID of the user to be followed
            followerId: id, // ID of the person following the user.
            followee: username // Obsolete
          });

          response(res).created({
            message: `you just followed ${username}`
          });
        } else {
          response(res).forbidden({
            message: `you are already following ${username}`
          });
        }
      }
    } catch (err) {
      return response(res).serverError({ message: 'Could not follow user' });
    }
  }

  /**
   * @description This controller method handles unfollow user
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async unfollowUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const followee = await User.findOne({
        where: {
          username
        }
      });
      // Does user exists?
      if (!followee) {
        return response(res).notFound(`User ${username} does not exists`);
      }

      // Is user to be unfollowed same as logged in user
      if (followee.id === id) {
        response(res).forbidden({
          message: 'you cannot unfollow yourself'
        });
      } else {
        // Get follow record.
        const followRecord = await Follower.find({
          where: {
            userId: followee.id,
            followerId: id
          }
        });

        // Is user following this person?
        if (!followRecord) {
          response(res).notFound({
            message: `you are not following ${username}`,
          });
        } else {
          // Delete follow record.
          await followRecord.destroy();

          response(res).success({
            message: `${username} has been unfollowed`
          });
        }
      }
    } catch (err) {
      return response(res).serverError({ message: 'Could not unfollow user' });
    }
  }

  /**
   * @description This controller method lists all user profiles
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {object} Json response
   */
  static async profileList(req, res) {
    const { Op } = Sequelize;
    const { id, username } = req.user;

    try {
      const allUsers = await User.findAll({
        attributes: ['username', 'bio', 'image', 'id'],
        where: {
          username: {
            [Op.ne]: username
          }
        }
      });

      const userFollow = await Follower.findAll({
        where: { followerId: id },
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id']
          }
        ]
      });

      const followerId = userFollow.map(item => item.userId);

      const profiles = allUsers.map((item) => {
        item.dataValues.following = false;
        if (followerId.includes(item.dataValues.id)) item.dataValues.following = true;
        delete item.dataValues.id;
        return item.dataValues;
      });

      response(res).success({
        profiles
      });
    } catch (err) {
      return response(res).serverError({ message: 'Could not get user profiles' });
    }
  }
}

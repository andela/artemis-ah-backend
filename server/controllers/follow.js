import '@babel/polyfill';
import dotenv from 'dotenv';
import db from '../database/models';
import response from '../utils/response';

const { User, Follower } = db;
dotenv.config();

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
    const { username } = req.user;

    const users = await Follower.findAll({
      where: { followee: username },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['firstname', 'lastname', 'email', 'username']
        },
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
    const following = await Follower.findAll({
      where: { userId: id },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['firstname', 'lastname', 'email', 'username']
        },
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
    if (username === req.user.username) {
      response(res).forbidden({
        message: 'you cannot follow yourself'
      });
    } else {
      const followee = await User.findOne({
        where: { username }
      });
      const user = await Follower.findOne({
        where: {
          userId: id,
          followee: username
        }
      });
      if (!user && followee) {
        await Follower.create({
          userId: id,
          followerId: followee.id,
          followee: username
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

    if (username === req.user.username) {
      response(res).forbidden({
        message: 'you cannot unfollow yourself'
      });
    } else {
      const follow = await Follower.find({
        where: {
          userId: id,
          followee: username,
        },
      });

      if (!follow) {
        response(res).notFound({
          message: 'user not found',
        });
      } else {
        await follow.destroy();
        response(res).success({
          message: `${username} has been unfollowed`
        });
      }
    }
  }
}

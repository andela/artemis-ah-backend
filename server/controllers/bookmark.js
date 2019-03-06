import '@babel/polyfill';
import dotenv from 'dotenv';
import db from '../database/models';
import { response } from '../utils';

const { User, Bookmark, Article } = db;
dotenv.config();

/**
 * @description Controller to bookmark articles
 * @return {undefined}
 */
export default class BookmarkController {
  /**
   * @description controller function that handles article bookmark
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @return {undefined}
   */
  static async createBookmark(req, res) {
    const { slug } = req.params;
    const { id } = req.user;
    try {
      const userData = await User.findOne({
        where: { id }
      });

      const articleData = await Article.findOne({
        where: { slug }
      });
      if (!userData) {
        response(res).notFound({ message: 'user not found' });
      } else if (!articleData) {
        response(res).notFound({ message: 'article not found' });
      } else {
        const bookmarks = await Bookmark.findOne({
          where: {
            userId: id,
            articleId: articleData.id
          }
        });
        if (bookmarks) {
          response(res).badRequest({ message: 'you have bookmarked this article already' });
        } else {
          await Bookmark.create({
            userId: id,
            articleId: articleData.id
          });
          response(res).created({
            message: 'article bookmarked successfully'
          });
        }
      }
    } catch (err) {
      response(res).sendData(500, 'Server Error');
    }
  }

  /**
  * @description This controller method handles delete bookmarked article
  *
  * @param {object} req - Express request object
  * @param {object} res - Express response object
  * @return {undefined}
  */
  static async removeBookmark(req, res) {
    const { id } = req.user;
    const { slug } = req.params;
    try {
      const articleData = await Article.findOne({
        where: { slug }
      });
      if (!articleData) {
        return response(res).notFound({
          message: 'article doesn\'t exist or has been deleted'
        });
      }
      const bookmarkData = await Bookmark.findAll({
        where: {
          userId: id,
          articleId: articleData.id,
        },
      });

      if (bookmarkData.length < 1) return response(res).notFound({ message: 'bookmark doesn\'t exist' });

      if (id !== bookmarkData[0].userId) {
        response(res).forbidden({
          message: 'this bookmark doesn\'t belong to you'
        });
      } else {
        await bookmarkData[0].destroy();
        response(res).success({ message: 'bookmark removed successfully' });
      }
    } catch (err) {
      response(res).sendData(500, { message: 'Server Error' });
    }
  }

  /**
   * @description This controller method handles fetching a users bookmarks
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @returns {object} response
   */
  static async getBookmarks(req, res) {
    try {
      const { id } = req.user;
      const userData = await User.findByPk(id);
      if (!userData) {
        return response(res).notFound({
          message: 'user not found'
        });
      }
      const userBookmarks = await Bookmark.findAll({
        where: { userId: id },
        attributes: {
          exclude: [
            'id',
            'userId',
            'articleId',
            'createdAt',
            'updatedAt']
        },
        include: [{
          model: Article,
          attributes: [
            'slug',
            'title',
            'description',
            'body',
            'totalClaps',
            'createdAt',
            'updatedAt']
        }]
      });

      if (userBookmarks.length < 1) {
        response(res).success({ message: 'you have no bookmarks' });
      } else {
        response(res).success({
          message: 'all bookmarks delivered successfully',
          userBookmarks: userBookmarks.map(data => data.Article)
        });
      }
    } catch (error) {
      response(res).serverError({ message: 'Server Error' });
    }
  }
}

import db from '../database/models';
import { response } from '../utils';

const { Bookmark, Article, User } = db;

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
    const userData = req.user;
    const articleData = req.article;
    try {
      const bookmarks = await Bookmark.findOne({
        where: {
          userId: userData.id,
          articleId: articleData.id
        }
      });

      if (bookmarks) return response(res).badRequest({ message: 'you have bookmarked this article already' });

      const article = await Article.findOne({
        where: { id: articleData.id }
      });

      const articleAuthor = await User.findOne({
        where: { id: article.userId }
      });

      await Bookmark.create({
        userId: userData.id,
        articleId: articleData.id,
        articleAuthor: articleAuthor.username
      });
      response(res).created({
        message: 'article bookmarked successfully'
      });
    } catch (err) {
      return response(res).sendData(500, 'Server Error');
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
    const userData = req.user;
    const articleData = req.article;
    try {
      const bookmarkData = await Bookmark.findAll({
        where: {
          userId: userData.id,
          articleId: articleData.id,
        },
      });

      if (bookmarkData.length < 1) return response(res).notFound({ message: 'bookmark doesn\'t exist' });
      await bookmarkData[0].destroy();
      response(res).success({ message: 'bookmark removed successfully' });
    } catch (err) {
      return response(res).sendData(500, { message: 'Server Error' });
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
    const userData = req.user;
    try {
      const userBookmarks = await Bookmark.findAll({
        where: { userId: userData.id },
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
            'userId',
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
          userBookmarks: userBookmarks.map((data) => {
            const {
              slug,
              userId,
              title,
              description,
              body,
              totalClaps,
              createdAt,
              updatedAt
            } = data.Article;
            const { articleAuthor } = data;

            return {
              articleAuthor,
              slug,
              userId,
              title,
              description,
              body,
              totalClaps,
              createdAt,
              updatedAt
            };
          })
        });
      }
    } catch (error) {
      return response(res).serverError({ message: 'Server Error' });
    }
  }
}

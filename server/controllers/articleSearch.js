import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import db from '../database/models';
import { response } from '../utils';

const { Op } = Sequelize;
const { Article, User, Tag } = db;
dotenv.config();

/**
 * @description implements article search
 */
export default class ArticleSearch {
  /**
   * @description modifies string
   * @param {*} str
   * @returns {string} formatted string
   */
  static modifyString(str) {
    const trimString = str.trim();
    return trimString.replace('%20', ' ');
  }

  /**
   * @description search method
   * @param {*} req - The request object
   * @param {*} res - The response object
   * @returns {array} - Search results
   */
  static async search(req, res) {
    const titleResults = ArticleSearch.searchByTitle(req, res);
    const authorResults = ArticleSearch.filterByAuthors(req, res);
    const tagResults = ArticleSearch.searchByTag(req, res);

    const allResults = await Promise.all([titleResults, authorResults, tagResults]);
    const searchResults = allResults.some(result => result.length > 0);

    if (searchResults) {
      return response(res).success({ allResults });
    }
    return response(res).notFound({ message: 'no article found, redefine keyword' });
  }

  /**
   * @description search method
   * @param {*} req
   * @param {*} res
   * @returns {Array} articles
   */
  static async searchByTitle(req, res) {
    try {
      const keyword = ArticleSearch.modifyString(req.query.title);
      const articles = await Article.findAll({
        where: { title: { [Op.iLike]: `%${keyword}%` } },
        raw: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });

      return articles;
    } catch (err) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }

  /**
   * @description searchByTag method
   * @param {*} req
   * @param {*} res
   * @returns {Array} articles
   */
  static async searchByTag(req, res) {
    try {
      const keyword = ArticleSearch.modifyString(req.query.title);
      const tag = await Tag.findAll({
        where: { name: { [Op.iLike]: `%${keyword}%` } },
        raw: true
      });

      if (tag.length === 0) {
        return [];
      }

      const tagId = (tag[0].id);

      const articles = await Article.findAll({
        raw: true,
        where: { tagId },
        include: [{ model: User, attributes: ['username', 'bio', 'image'] }]
      });

      return articles;
    } catch (err) {
      return response(res).serverError({ errors: { server: ['database error'] } });
    }
  }

  /**
   * @description filter method
   * @param {*} req
   * @param {*} res
   * @returns {object} filtered articles
   */
  static async filter(req, res) {
    try {
      const param = Object.keys(req.query)[0];
      const paramValue = ArticleSearch.modifyString(Object.values(req.query)[0]);
      let articles = [];

      if (param === 'title') {
        articles = await Article.findAll({
          where: { title: paramValue },
          include: [
            {
              model: User,
              attributes: ['username', 'bio', 'image']
            },
            {
              model: Tag,
              attributes: ['name']
            }
          ]
        });
      } else if (param === 'author') {
        const user = await User.findAll({
          where: { username: paramValue }
        });

        const userId = user.length === 0 ? 0 : user[0].id;
        articles = await Article.findAll({
          where: { userId },
          include: [
            {
              model: User,
              attributes: ['username', 'bio', 'image']
            },
            {
              model: Tag,
              attributes: ['name']
            }
          ]
        });
      } else if (param === 'tag') {
        const tagResult = await Tag.findAll({
          where: { name: paramValue }
        });

        const tagId = tagResult.length === 0 ? 0 : tagResult[0].id;
        articles = await Article.findAll({
          where: { tagId },
          include: [
            {
              model: User,
              attributes: ['username', 'bio', 'image']
            },
            {
              model: Tag,
              attributes: ['name']
            }
          ]
        });
      }

      if (articles.length === 0) {
        return response(res).notFound({ message: 'No article found with that match' });
      }

      response(res).success({ articles });
    } catch (err) {
      return response(res).serverError();
    }
  }

  /**
   * @description search by author method
   * @param {*} req the Request object
   * @param {*} res the Response object
   * @returns {object} Articles by specified authors
   */
  static async filterByAuthors(req, res) {
    const author = ArticleSearch.modifyString(req.query.title);
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: {
            firstname: {
              [Op.iLike]: `%${author}%`
            },
            lastname: {
              [Op.iLike]: `%${author}%`
            },
            username: {
              [Op.iLike]: `%${author}%`
            },
          }
        },
        raw: true,
        attributes: {
          excludes: ['createdAt', 'updatedAt']
        }
      });
      if (req.params.authors && users[0]) {
        return response(res).success({ users });
      }
      if (req.params.authors && !users[0]) {
        return response(res).notFound({ message: 'No such author exists.' });
      }
      return users;
    } catch (error) {
      return response(res).serverError();
    }
  }
}

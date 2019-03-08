import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import db from '../database/models';
import { response } from '../utils';

const { Op } = Sequelize;
const { Article } = db;
dotenv.config();

/**
 * @description implements article search
 */
export default class ArticleSearch {
  /**
   * @discription modifies string
   * @param {*} str
   * @returns {string} formatted string
   */
  static modifyString(str) {
    const trimString = str.trim();
    return trimString.replace('%20', ' ');
  }

  /**
   * @description search method
   * @param {*} req
   * @param {*} res
   * @returns {Array} articles
   */
  static async search(req, res) {
    try {
      const keyword = ArticleSearch.modifyString(req.query.title);
      const articles = await Article.findAll({ where: { title: { [Op.iLike]: `%${keyword}%` } } });

      if (!articles[0]) response(res).notFound({ message: 'no article found, redefine keyword' });
      else response(res).success({ articles });
    } catch (err) {
      response(res).serverError();
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
      const title = ArticleSearch.modifyString(req.query.title);

      const articles = await Article.findAll({ where: { title: { [Op.iLike]: `%${title}` } } });

      if (!articles[0]) response(res).notFound({ message: `no article found with title '${title}'` });
      else response(res).success({ articles });
    } catch (err) {
      response(res).serverError();
    }
  }
}

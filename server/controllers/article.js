/* eslint class-methods-use-this: "off" */
import slugify from 'slug';
import { validationResult } from 'express-validator/check';
import { HelperUtils } from '../utils';
import response, { validationErrors } from '../utils/response';
import db from '../database/models';

const { Article, Tag, User } = db;

/**
 * @class ArticleController
 * @exports ArticleController
 */
class ArticleController {
  /**
   */
  constructor() {
    this.defaultLimit = 20;
    this.article = {};
    this.tags = [];
  }

  /**
   * @method create
   * @description Creates a new
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {null} - Returns nothing
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      response(res).badRequest({
        errors: validationErrors(errors)
      });
    } else {
      const {
        title, description, body, tagId
      } = req.body;
      let slug = slugify(title, {
        lower: true
      });

      // Insert into database
      Article.create(Object.assign(this.article, {
        userId: req.user.id,
        title,
        description,
        body,
        tagId
      })).then((article) => {
        slug = slug.concat(`-${article.id}`);
        article.slug = slug;

        // Append id to slug and update.
        return Article.update({
          slug
        },
        {
          where: {
            id: article.id
          }
        }).then(() => article);
      })
        .then((article) => {
          article.userId = undefined;
          const readTime = HelperUtils.estimateReadingTime(article.body);
          article.dataValues.readTime = readTime;

          response(res).created({
            article
          });
        });
    }
  }

  /**
   * Returns all tags
   * @method getTags
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {null} - Returns nothing
   */
  async getTags(req, res) {
    try {
      this.tags = await Tag.findAll({ where: {} });
      response(res).success({
        tags: this.tags
      });
    } catch (err) {
      response(res).serverError({
        message: 'Could not get all tags'
      });
    }
  }

  /**
   * @method getAll
   * @param {object} req The request object from the route
   * @param {object} res The response object from the route
   * @returns {object} - Article details
   */
  getAll(req, res) {
    let offset = 0; // Default offset.

    const { query } = req;
    // If limit is specified.
    const limit = query.limit ? query.limit : this.defaultLimit;
    // If page is specified.
    if (query.page) {
      offset = (query.page - 1) * limit;
    }

    const sequelizeOptions = {
      where: {},
      offset, // Default is page 1
      limit,
      include: [{
        model: User,
        attributes: ['username', 'bio', 'image'],
      }, {
        model: Tag,
        attributes: ['name']
      }],
      attributes: [
        'id',
        'slug',
        'title',
        'description',
        'body',
        'totalClaps',
        'createdAt',
        'updatedAt'
      ]
    };

    // If query author=? is in url, filter by author.
    if (query.author) {
      sequelizeOptions.where['$User.username$'] = query.author;
    }

    Article.findAll(sequelizeOptions).then((articles) => {
      response(res).success({
        articles: articles.map((article) => {
          const readTime = HelperUtils.estimateReadingTime(article.body);
          article.dataValues.readTime = readTime;
          return article;
        })
      });
    });
  }

  /**
   * @method getSingleArticle
   * @description Get a single article
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} A single article object
   */
  async getSingleArticle(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({
      where: {
        slug
      }
    });

    response(res).success({ messages: article });
  }
}

export default ArticleController;

import slugify from 'slug';
import { validationResult } from 'express-validator/check';
import { HelperUtils } from '../utils';
import response, { validationErrors } from '../utils/response';
import db from '../database/models';

const {
  Article, Tag, User, Rating
} = db;

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
    this.rating = 0;
    this.ratings = [];
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
    // let limit = this.defaultLimit; // Default limit.
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
        'rating',
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
* rates an article
* @method rateArticle
* @param {object} req The request object from the route
* @param {object} res The response object from the route
* @returns {object} - Success message
*/
  async rateArticle(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response(res).badRequest({
        errors: validationErrors(errors)
      });
    }
    const { rating } = req.body;
    this.rating = Number(rating);
    const articleId = req.article.id;
    if (req.article.userId === req.user.id) {
      return response(res).forbidden({
        message: 'You cant rate your own article'
      });
    }
    try {
      const existingRatings = await Rating.findAll({ where: { articleId } });
      const userExistingRating = existingRatings.find(r => r.userId === req.user.id);
      if (userExistingRating) {
        return response(res).badRequest({
          message: 'Rating already given for this article'
        });
      }
      await Rating.create({
        userId: req.user.id,
        articleId,
        rating
      });

      await req.article.update({
        rating: HelperUtils
          .calcArticleRating(existingRatings.length,
            req.article.rating,
            this.rating)
      });

      return response(res).success({
        message: 'You have successfully rated this article'
      });
    } catch (error) {
      return response(res).serverError({
        message: 'Could not get ratings'
      });
    }
  }

  /**
  * rates an article
  * @method getRatings
  * @param {object} req The request object from the route
  * @param {object} res The response object from the route
  * @returns {object} - Ratings for the article
  */
  async getRatings(req, res) {
    try {
      this.ratings = await Rating.findAll({ where: { articleId: req.article.id } });
      response(res).success({
        ratings: this.ratings
      });
    } catch (error) {
      response(res).serverError({
        message: 'Couldnt get ratings'
      });
    }
  }
}

export default ArticleController;

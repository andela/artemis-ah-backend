import slugify from 'slug';
import { validationResult } from 'express-validator/check';
import response, { validationErrors } from '../utils/response';
import db from '../database/models';

const { Article, Tag } = db;

class ArticleController {
  /**
   * Creates a new 
   * 
   * @param {object} req The request object
   * @param {object} res The response object
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      response(res).badRequest({
        errors: validationErrors(errors),
      });
    } else {
      const { title, description, body, tagId } = req.body;
      let slug = slugify(title, {
        lower: true,
      });

      // Insert into database
      Article.create({
        userId: 2,
        title,
        description,
        body,
        tagId
      }).then((article) => {
        slug = slug.concat(`-${article.id}`);
        article.slug = slug;

        // Append id to slug and update. 
        return Article.update({
          slug,
        }, {
          where: {
            id: article.id,
          }
        }).then(dbRes => article);
      }).then(article => {
        article.userId = undefined;

        response(res).created({
          article,
        });
      });
    }
  }
  /**
   * Returns all tags
   * 
   * @param {object} req The request object
   * @param {object} res The response object
   */
  async getTags(req, res){
    try{
      const allTags = await Tag.findAll({ where: {} });
      response(res).success({
        tags: allTags
      })
    }
    catch(err){
      response(res).serverError({ 
        message: 'Could not get all tags'
      })
    }
  }
}

export default ArticleController;

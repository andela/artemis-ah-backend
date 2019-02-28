import response, { validationErrors } from '../utils/response';
import { validationResult } from 'express-validator/check';
import { Article } from '../database/models';
import slugify from 'slug';

class ArticleController {
  /**
   * Creates a new 
   * 
   * @param {*} req The request object
   * @param {*} res The response object
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      response(res).badRequest({
        errors: validationErrors(errors),
      });
    } else {
      const { title, description, body } = req.body;
      let slug = slugify(title, {
        lower: true,
      });

      // Insert into database
      Article.create({
        userId: 2,
        title,
        description,
        body,
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
}

export default ArticleController;

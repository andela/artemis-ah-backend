import { check } from 'express-validator/check';
import dotenv from 'dotenv';

dotenv.config();

export default [
  // Validate title of article
  check('title')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Title is required'),

  // Validate description of article
  check('description')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Description is required'),

  // Validate body of article
  check('body')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Body is required'),

  // Validate cover URL
  check('cover')
    .optional()
    .custom((value, { req }) => {
      const { cover } = req.body;

      // Cover URL must be a valid URL of an image uploaded to cloudinary
      const articleCoverPathRegex = process.env.ARTICLE_COVER_URL_PATH.replace(/\//g, '\\/');
      const isValidUrl = (new RegExp(`^${articleCoverPathRegex}\\/.+`)).test(cover);

      return isValidUrl;
    })
    .withMessage('Cover URL is not valid')
];

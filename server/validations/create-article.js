import { check } from 'express-validator/check';

export default [
  // Validate title of article
  check('title')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('minimum character length for title should be 5')
    .isLength({ max: 200 })
    .withMessage('maximum character length for title should be 200'),

  // Validate description of article
  check('description')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Description is required')
    .isLength({ min: 5 })
    .withMessage('minimum character length for description should be 5')
    .isLength({ max: 1000 })
    .withMessage('maximum character length for description should be 1000'),

  // Validate body of article
  check('body')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Body is required')
    .isLength({ min: 10 })
    .withMessage('minimum character length for body should be 5')
];

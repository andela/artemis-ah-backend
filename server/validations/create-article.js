import { check } from 'express-validator/check';

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
    .withMessage('Body is required')
];

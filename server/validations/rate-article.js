import { check } from 'express-validator/check';

export default [
  // Validate rating of article
  check('rating')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage('Rating is required')
    .isNumeric()
    .withMessage('Rating must be a number')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

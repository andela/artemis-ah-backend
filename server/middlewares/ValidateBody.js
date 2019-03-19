// Validate body

import { body, validationResult } from 'express-validator/check';

const highlight = [
  body('highlighted')
    .exists()
    .withMessage('highlighted required')
    .isLength({ min: 1 })
    .withMessage('invalid highlighted text'),

  body('comment')
    .exists()
    .withMessage('comment required')
    .isLength({ min: 2 })
    .withMessage('comment required'),

  body('index')
    .exists()
    .withMessage('index required')
    .isNumeric()
    .withMessage('index should be a number')
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400, message: errors.array()[0].msg,
    });
  }
  return next();
};

export { highlight, validationHandler };

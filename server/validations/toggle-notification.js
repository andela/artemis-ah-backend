import { check } from 'express-validator/check';

export default [
  // Validate inAppNotification
  check('inAppNotification')
    .exists({
      checkNull: true
    })
    .withMessage('Please specify if you want to recieve in app notifications')
    .isBoolean()
    .withMessage('InAppNotification should be either true or false'),

  // Validate emailNotification
  check('emailNotification')
    .exists({
      checkNull: true
    })
    .withMessage('Please specify if you want to recieve email notifications')
    .isBoolean()
    .withMessage('emailNotification should be either true or false')
];

const { body } = require('express-validator');

exports.reportValidator = [
  body('reason')
    .notEmpty().withMessage('Reason cannot be empty')
    .isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long')
    .isLength({ max: 500 }).withMessage('Reason must not exceed 500 characters'),
];

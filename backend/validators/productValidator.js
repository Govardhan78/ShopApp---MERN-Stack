const { body } = require('express-validator');

const createProductValidator = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number')
];

module.exports = { createProductValidator };

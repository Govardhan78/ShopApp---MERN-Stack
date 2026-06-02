const { body } = require('express-validator');

const createShopValidator = [
  body('name').notEmpty().withMessage('Shop name is required'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number')
];

module.exports = { createShopValidator };

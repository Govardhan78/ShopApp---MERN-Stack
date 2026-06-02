const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, getMyProducts, getProductsByShop } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { createProductValidator } = require('../validators/productValidator');

router.get('/my', protect, getMyProducts);
router.get('/shop/:shopId', getProductsByShop);

router.post('/', protect, createProductValidator, createProduct);
router.put('/:id', protect, updateProduct);

module.exports = router;

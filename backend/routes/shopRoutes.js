const express = require('express');
const router = express.Router();
const { createShop, updateShop, getMyShop, getAllShopsWithProducts, getShopById } = require('../controllers/shopController');
const { protect } = require('../middleware/auth');
const { createShopValidator } = require('../validators/shopValidator');

router.get('/', getAllShopsWithProducts);
router.get('/my', protect, getMyShop);
router.get('/:id', getShopById);

router.post('/', protect, createShopValidator, createShop);
router.put('/:id', protect, updateShop);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMessages, getShopOwners, getAdmin } = require('../controllers/chatController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/messages/:userId', protect, getMessages);
router.get('/owners', protect, adminOnly, getShopOwners);
router.get('/admin', protect, getAdmin);

module.exports = router;

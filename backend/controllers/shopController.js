const Shop = require('../models/Shop');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

const createShop = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, category, address, phone } = req.body;

  try {
    const shop = await Shop.create({
      name,
      description,
      category,
      address,
      phone,
      owner: req.user.id
    });

    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: 'No shop found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllShopsWithProducts = async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email');
    const result = await Promise.all(
      shops.map(async (shop) => {
        const products = await Product.find({ shop: shop._id });
        return { ...shop.toObject(), products };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const products = await Product.find({ shop: shop._id });
    res.json({ ...shop.toObject(), products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createShop, updateShop, getMyShop, getAllShopsWithProducts, getShopById };

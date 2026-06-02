const Product = require('../models/Product');
const Shop = require('../models/Shop');

const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: 'Create a shop first' });

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      shop: shop._id
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: 'No shop found' });

    const products = await Product.find({ shop: shop._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductsByShop = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.params.shopId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProduct, updateProduct, getMyProducts, getProductsByShop };

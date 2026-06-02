const Message = require('../models/Message');
const User = require('../models/User');

const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const myId = req.user.id;
    const roomId = [myId, userId].sort().join('_');

    const messages = await Message.find({ roomId })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getShopOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'user' }).select('-password');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');
    if (!admin) return res.status(404).json({ message: 'No admin found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, getShopOwners, getAdmin };

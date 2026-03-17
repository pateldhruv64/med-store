const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const { username, password, role, securityKey } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
    if (securityKey !== process.env.REGISTRATION_KEY) return res.status(400).json({ message: 'Invalid security key' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role });
    res.status(201).json({ message: 'User registered' });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: user.role });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) { next(err); }
}; 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
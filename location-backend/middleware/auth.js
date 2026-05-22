const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verification token decode verification check
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Extract user from DB, omitting password hash field entirely
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User context no longer exists.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Session token has expired or is corrupt.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Missing token header signatures.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Department role '${req.user.role}' is not authorized to perform this action.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
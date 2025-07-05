const passport = require('passport');
const asyncHandler = require('express-async-handler');

// JWT Authentication middleware (using your existing passport JWT strategy)
const protect = passport.authenticate('jwt', { session: false });

// Admin middleware (optional - add if you need admin roles)
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized as admin' 
    });
  }
});

// Optional: Combine both middlewares for admin-only routes
const adminProtect = [
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Not authorized as admin' 
      });
    }
  }
];

module.exports = { 
  protect, 
  admin,
  adminProtect 
};
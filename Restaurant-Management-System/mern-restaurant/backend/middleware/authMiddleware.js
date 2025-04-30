// auth middleware code //

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Middleware to protect routes (require authentication) //
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header //
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token //
      token = req.headers.authorization.split(' ')[1];

      // Decode token //
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); 

      // Fetch user from DB without password //
      const user = await User.findById(decoded.id).select('-password');
      console.log('User fetched from DB:', user); 

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      // Attach user to request object //
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message); 
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// for admin //

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export { protect, admin };





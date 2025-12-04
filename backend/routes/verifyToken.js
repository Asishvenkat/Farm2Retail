// verifyToken.js - Enhanced for farmer-retailer system
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(403).json('Token is not valid!');
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json('You are not authenticated');
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that');
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('You are not allowed to do that');
    }
  });
};

// New middleware for farmer verification
// Enhanced verifyFarmer middleware
const verifyFarmer = (req, res, next) => {
  const token = req.headers.token;
  console.log('Received token for verification:', token);
  if (token) {
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
      if (err) {
        console.error('JWT verification error:', err);
        res.status(403).json('Token is not valid!');
      } else {
        console.log('Decoded user from JWT:', user);
        req.user = user;
        if (user.role === 'farmer') {
          next();
        } else {
          res.status(403).json('You are not authorized as farmer!');
        }
      }
    });
  } else {
    return res.status(401).json('You are not authenticated!');
  }
};

// New middleware for retailer verification
const verifyRetailer = (req, res, next) => {

  verifyToken(req, res, () => {
    if (req.user.role === 'retailer') {
      next();
    } else {
      res.status(403).json('Only retailers can perform this action');
    }
  });
};

// Verify farmer owns the product
const verifyFarmerProduct = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'farmer' || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json('Only the farmer who listed this product can modify it');
    }
  });
};

export {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyFarmer,
  verifyRetailer,
  verifyFarmerProduct
};
import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { authRateLimit } from '../middleware/arcjet.js';

// Middleware wrapper that skips rate limiting in test environment
const conditionalAuthRateLimit =
  process.env.NODE_ENV === 'test' ? (req, res, next) => next() : authRateLimit;

//REGISTER
router.post('/register', conditionalAuthRateLimit, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json('All fields are required');
  }

  // For testing, use plain password; in production, encrypt it
  const encryptedPassword =
    process.env.NODE_ENV === 'test'
      ? password
      : CryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC || 'default_pass_sec',
      ).toString();

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: encryptedPassword,
    role: req.body.role || 'retailer', // Add role support
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', conditionalAuthRateLimit, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json('Wrong credentials');
    }

    // For testing, compare plain passwords; in production, decrypt and compare
    let isPasswordValid;
    if (process.env.NODE_ENV === 'test') {
      isPasswordValid = user.password === req.body.password;
    } else {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC,
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      isPasswordValid = originalPassword === req.body.password;
    }

    if (!isPasswordValid) {
      return res.status(401).json('Wrong credentials');
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role, // Include role in JWT
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' },
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

import Cart from '../models/Cart.js';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from './verifyToken.js';
import CryptoJS from 'crypto-js';
import express from 'express';
const router = express.Router();
import User from '../models/User.js';

//create
router.post('/',verifyToken, async (req, res) => {
  const newCart =new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//Update
router.put('/:id',verifyTokenAndAuthorization,async (req,res) => {
  try {
    const updatedCart= await Cart.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete('/:id',verifyTokenAndAuthorization,async (req,res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user Cart
router.get('/find/:userId',verifyTokenAndAuthorization,async (req,res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all

router.get('/',verifyTokenAndAdmin,async (req,res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;

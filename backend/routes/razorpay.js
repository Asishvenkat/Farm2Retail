// routes/razorpay.js
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { paymentRateLimit } from '../middleware/arcjet.js';

const router = express.Router();

let razorpay = null;

const ensureRazorpay = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
    console.warn(
      'Razorpay credentials are missing. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your environment.'
    );
    razorpay = null;
    return null;
  }

  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET,
    });
  }

  return razorpay;
};

// Create Razorpay Order
router.post('/order', paymentRateLimit, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: `receipt_order_${Math.random() * 10000}`,
    };

    const client = ensureRazorpay();

    if (!client) {
      return res
        .status(500)
        .json({ message: 'Razorpay is not configured on the server.' });
    }

    const order = await client.orders.create(options);

    if (!order) {
      return res.status(500).send('Order creation failed');
    }
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).send('Server error');
  }
});

// Validate Payment Signature
router.post('/order/validate', paymentRateLimit, async (req, res) => {
  const client = ensureRazorpay();

  if (!client) {
    return res
      .status(500)
      .json({ message: 'Razorpay is not configured on the server.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: 'Invalid signature' });
  }

  res.json({
    msg: 'success',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

export default router;

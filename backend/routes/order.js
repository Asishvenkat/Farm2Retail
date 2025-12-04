import Order from '../models/Order.js';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from './verifyToken.js';
import Notification from '../models/Notification.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

import express from 'express';
const router = express.Router();

//create
router.post('/', async (req, res) => {
  console.log('Received order data:', req.body);

  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    console.log('Order saved successfully:', savedOrder);

    // Create notifications for farmers whose products are in the order
    const farmerIds = new Set();

    for (const item of savedOrder.products) {
      try {
        const product = await Product.findById(item.productId);
        if (product && product.farmerId) {
          farmerIds.add(product.farmerId);
        }
      } catch (err) {
        console.error('Error finding product:', err);
      }
    }

    // Send notification to each farmer
    for (const farmerId of farmerIds) {
      try {
        const notification = new Notification({
          userId: farmerId,
          type: 'NEW_ORDER',
          title: 'New Order Received! 🎉',
          message: `You have received a new order. Order ID: ${savedOrder._id.toString().slice(-6)}`,
          link: '/farmer/orders',
          read: false
        });
        await notification.save();

        // Emit socket event for real-time notification
        const io = req.app.get('io');
        if (io) {
          io.emit('notification', {
            userId: farmerId,
            notification: {
              _id: notification._id,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              link: notification.link,
              createdAt: notification.createdAt
            }
          });
        }
      } catch (err) {
        console.error('Error creating farmer notification:', err);
      }
    }

    res.status(200).json(savedOrder);
  } catch (err) {
    console.error('Order save error:', err);
    res.status(500).json({
      error: err.message,
      details: err.errors || err
    });
  }
});


//Update - Send notification to retailer when delivery status changes
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id);

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );

    // Check if status changed and notify retailer
    if (oldOrder && req.body.status && oldOrder.status !== req.body.status) {
      try {
        let statusMessage = '';
        let statusEmoji = '';

        switch (req.body.status.toLowerCase()) {
        case 'completed':
        case 'delivered':
          statusMessage = 'Your order has been delivered successfully!';
          statusEmoji = '✅';
          break;
        case 'cancelled':
          statusMessage = 'Your order has been cancelled.';
          statusEmoji = '❌';
          break;
        case 'pending':
          statusMessage = 'Your order is being processed.';
          statusEmoji = '⏳';
          break;
        default:
          statusMessage = `Your order status has been updated to: ${req.body.status}`;
          statusEmoji = '📦';
        }

        const notification = new Notification({
          userId: updatedOrder.userId,
          type: 'ORDER_STATUS_UPDATE',
          title: `${statusEmoji} Order Status Updated`,
          message: `${statusMessage} Order ID: ${updatedOrder._id.toString().slice(-6)}`,
          link: '/orders',
          read: false
        });
        await notification.save();

        // Emit socket event for real-time notification
        const io = req.app.get('io');
        if (io) {
          io.emit('notification', {
            userId: updatedOrder.userId,
            notification: {
              _id: notification._id,
              type: notification.type,
              title: notification.title,
              message: notification.message,
              link: notification.link,
              createdAt: notification.createdAt
            }
          });
        }
      } catch (err) {
        console.error('Error creating retailer notification:', err);
      }
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete('/:id',verifyTokenAndAdmin,async (req,res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user Orders
router.get('/find/:userId',verifyTokenAndAuthorization,async (req,res) => {
  try {
    const orders=await Order.find({ userId:req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get farmer orders with populated product and user details
router.get('/farmer/:farmerId', async (req, res) => {
  try {

    console.log('Fetching orders for farmer ID:', req.params.farmerId);

    // Get all orders
    const orders = await Order.find().lean();
    console.log('Total orders in database:', orders.length);

    // Filter and populate orders that contain farmer's products
    const farmerOrders = [];

    for (const order of orders) {
      // Populate product details for each product in the order
      const populatedProducts = [];
      let hasFarmerProduct = false;

      for (const item of order.products) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            console.log('Product found:', product.name, 'Farmer ID:', product.farmerId, 'Match:', product.farmerId === req.params.farmerId);

            // Check if this product belongs to the farmer
            if (product.farmerId === req.params.farmerId) {
              hasFarmerProduct = true;
            }

            populatedProducts.push({
              ...item,
              productDetails: {
                _id: product._id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                farmerId: product.farmerId,
                farmerName: product.farmerName,
                category: product.category,
                images: product.images
              }
            });
          } else {
            console.log('Product not found for ID:', item.productId);
          }
        } catch (err) {
          console.error('Error populating product:', err);
        }
      }

      // If order contains farmer's products, add it with customer details
      if (hasFarmerProduct) {
        console.log('Found order with farmer products:', order._id);
        try {
          const customer = await User.findById(order.userId);
          farmerOrders.push({
            ...order,
            products: populatedProducts,
            customer: customer ? {
              _id: customer._id,
              username: customer.username,
              email: customer.email,
              phone: customer.phone
            } : null
          });
        } catch (err) {
          console.error('Error populating customer:', err);
          farmerOrders.push({
            ...order,
            products: populatedProducts,
            customer: null
          });
        }
      }
    }

    console.log('Total farmer orders:', farmerOrders.length);
    res.status(200).json(farmerOrders);
  } catch (err) {
    console.error('Error fetching farmer orders:', err);
    res.status(500).json({ error: err.message });
  }
});

//Get monthly income
router.get('/income', async (req, res) => {
  try {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: twoMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get monthly sales count
router.get('/sales', async (req, res) => {
  try {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const sales = await Order.aggregate([
      { $match: { createdAt: { $gte: twoMonthsAgo } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get all
router.get('/',async (req,res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
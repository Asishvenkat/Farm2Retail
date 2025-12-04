import express from 'express';
const router = express.Router();
import Notification from '../models/Notification.js';
import { verifyToken, verifyTokenAndAuthorization } from './verifyToken.js';

// Get user notifications
router.get('/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread notification count
router.get(
  '/:userId/unread/count',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        userId: req.params.userId,
        read: false,
      });

      res.status(200).json({ count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
router.put(
  '/:userId/read-all',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await Notification.updateMany(
        { userId: req.params.userId, read: false },
        { read: true },
      );

      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Create notification (usually called internally)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.body.userId).emit('notification:new', savedNotification);

    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all read notifications
router.delete(
  '/:userId/clear-read',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await Notification.deleteMany({ userId: req.params.userId, read: true });
      res.status(200).json({ message: 'Read notifications cleared' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;

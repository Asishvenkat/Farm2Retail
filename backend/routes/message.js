const router = require('express').Router();
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');

// Get conversation between two users
router.get('/conversation/:userId/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(100)
    .populate('senderId', 'username')
    .populate('receiverId', 'username');
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations for a user
router.get('/conversations/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get unique conversation partners
    const sent = await Message.distinct('receiverId', { senderId: userId });
    const received = await Message.distinct('senderId', { receiverId: userId });
    
    // Ensure unique partners by converting to Set and filtering out the user's own ID
    const conversationPartners = [...new Set([...sent, ...received])].filter(
      partnerId => partnerId.toString() !== userId.toString()
    );
    
    // Get last message for each conversation
    const conversations = await Promise.all(
      conversationPartners.map(async (partnerId) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: partnerId },
            { senderId: partnerId, receiverId: userId }
          ]
        })
        .sort({ createdAt: -1 })
        .populate('senderId', 'username')
        .populate('receiverId', 'username');
        
        const unreadCount = await Message.countDocuments({
          senderId: partnerId,
          receiverId: userId,
          read: false
        });
        
        return {
          partnerId,
          lastMessage,
          unreadCount
        };
      })
    );
    
    // Sort conversations by most recent message
    const sortedConversations = conversations
      .filter(conv => conv.lastMessage) // Remove conversations without messages
      .sort((a, b) => {
        const dateA = a.lastMessage?.createdAt || new Date(0);
        const dateB = b.lastMessage?.createdAt || new Date(0);
        return dateB - dateA; // Most recent first
      });
    
    res.status(200).json(sortedConversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if conversation exists between two users
router.get('/check-conversation/:userId/:otherUserId', verifyToken, async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    // Check if any messages exist between these users
    const conversationExists = await Message.findOne({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    });
    
    res.status(200).json({ 
      exists: !!conversationExists,
      otherUserId: otherUserId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message (also handled via socket, but this saves to DB)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    
    // Populate sender info
    await savedMessage.populate('senderId', 'username');
    
    // Create notification for the receiver
    try {
      const notification = new Notification({
        userId: savedMessage.receiverId,
        type: 'NEW_MESSAGE',
        title: 'New Message',
        message: `You have a new message from ${savedMessage.senderId.username}`,
        link: '/messages',
        read: false
      });
      await notification.save();
      
      // Emit notification via socket
      const io = req.app.get('io');
      io.to(savedMessage.receiverId.toString()).emit('notification:newMessage', notification);
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }
    
    // Emit socket event
    const io = req.app.get('io');
    io.emit('chat:newMessage', savedMessage);
    
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark messages as read
router.put('/read/:senderId/:receiverId', verifyToken, async (req, res) => {
  try {
    await Message.updateMany(
      { 
        senderId: req.params.senderId, 
        receiverId: req.params.receiverId,
        read: false 
      },
      { 
        read: true,
        readAt: new Date()
      }
    );
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread message count
router.get('/unread/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.params.userId,
      read: false
    });
    
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

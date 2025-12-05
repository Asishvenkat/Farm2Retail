import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'NEW_ORDER',
        'ORDER_STATUS_UPDATE',
        'ORDER_STATUS',
        'PRODUCT_UPDATE',
        'PRICE_CHANGE',
        'STOCK_UPDATE',
        'PAYMENT',
        'MESSAGE',
        'SYSTEM',
        'NEW_MESSAGE',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// Index for faster queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', NotificationSchema);

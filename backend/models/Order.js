import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ],
        amount: { type: Number, required: true },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: "India" }
        },
        status: { type: String, default: 'pending' },
        paymentId: { type: String }, // Razorpay payment ID
        orderId: { type: String }, // Razorpay order ID
    },
    { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // vegetables, fruits, grains, dairy
    images: { type: Array, default: [] },
    price: { type: Number, required: true }, // base price per kg/unit (can be derived from first bulk tier)
    quantity: { type: Number, required: true }, // total available quantity
    unit: { type: String, required: true }, // kg, tons, pieces, liters
    farmerId: { type: String, required: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String }, // Add this for contact functionality
    location: { type: String, required: true }, // farm location
    harvestDate: { type: Date, required: true },
    expiryDate: { type: Date },
    available: { type: Boolean, default: true },
    organic: { type: Boolean, default: false },
    quality: { type: String, enum: ['Premium', 'Grade A', 'Grade B'], default: 'Grade A' },

    // Add bulkTiers field - this is what was missing!
    bulkTiers: [{
      quantity: { type: Number, required: true }, // bulk quantity (e.g., 10, 50, 100)
      price: { type: Number, required: true }     // price per unit for this tier
    }]
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
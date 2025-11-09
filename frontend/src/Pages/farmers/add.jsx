import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { uploadMultipleToCloudinary } from '../../cloudinaryConfig';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    location: '',
    harvestDate: '',
    expiryDate: '',
    organic: false,
    unit: 'kg'
  });

  const [bulkTiers, setBulkTiers] = useState([{ quantity: 10, price: '' }]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBulkTierChange = (i, field, value) => {
    setBulkTiers((prev) =>
      prev.map((tier, idx) =>
        i === idx ? { ...tier, [field]: value } : tier
      )
    );
  };

  const addBulkTier = () => setBulkTiers((prev) => [...prev, { quantity: '', price: '' }]);
  const removeBulkTier = (index) => {
    if (bulkTiers.length > 1)
      setBulkTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    try {
      const urls = await uploadMultipleToCloudinary(files);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('farmerToken');
      const response = await fetch(`${API_BASE_URL}products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images,
          bulkTiers,
          price: bulkTiers[0]?.price || 0,
          quantity: bulkTiers.reduce((sum, t) => sum + t.quantity, 0)
        })
      });

      if (response.ok) {
        alert('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          category: 'vegetables',
          location: '',
          harvestDate: '',
          expiryDate: '',
          organic: false,
          unit: 'kg'
        });
        setBulkTiers([{ quantity: 10, price: '' }]);
        setImages([]);
      } else {
        throw new Error('Failed');
      }
    } catch {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Add New Product</h2>
        <div className="space-y-4">
          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
            </select>
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-20 focus:ring-2 focus:ring-green-500"
          />

          {/* Location, Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="location"
              placeholder="Farm Location"
              value={formData.location}
              onChange={handleChange}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Harvest Date</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Unit */}
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="kg">Kg</option>
            <option value="tons">Tons</option>
            <option value="pieces">Pieces</option>
          </select>

          {/* Bulk Pricing */}
          <div>
            <h3 className="font-semibold mb-3">Bulk Pricing</h3>
            {bulkTiers.map((tier, index) => (
              <div key={index} className="flex gap-4 mb-2 items-center">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={tier.quantity}
                  onChange={(e) =>
                    handleBulkTierChange(index, 'quantity', parseInt(e.target.value) || 0)
                  }
                  className="border rounded px-3 py-2 w-32 focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={tier.price}
                  onChange={(e) =>
                    handleBulkTierChange(index, 'price', parseFloat(e.target.value) || '')
                  }
                  className="border rounded px-3 py-2 w-32 focus:ring-2 focus:ring-green-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeBulkTier(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBulkTier}
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <Plus className="h-4 w-4" /> Add Tier
            </button>
          </div>

          {/* Organic Checkbox */}
          <label className="flex items-center">
            <input
              type="checkbox"
              name="organic"
              checked={formData.organic}
              onChange={handleChange}
              className="mr-2"
            />
            Organic Certified
          </label>

          {/* Images */}
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded px-3 py-2"
            />
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;

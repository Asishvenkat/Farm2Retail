import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../requestMethods";
import { Plus, Trash2, UploadCloud, ImagePlus } from 'lucide-react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { uploadMultipleToCloudinary } from '../../cloudinaryConfig';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '', description: '', category: 'vegetables', 
    unit: 'kg', location: '', harvestDate: '', expiryDate: '', organic: false,
    quality: 'Grade A', images: []
  });

  const [bulkTiers, setBulkTiers] = useState([{ quantity: 10, price: '' }]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}products/${id}`, {
          headers: { token: `Bearer ${localStorage.getItem("farmerToken")}` }
        });
        const data = await res.json();
        if (res.ok) {
          setProduct({
            ...data,
            harvestDate: data.harvestDate?.substring(0, 10),
            expiryDate: data.expiryDate?.substring(0, 10),
            images: data.images || []
          });
          setBulkTiers(data.bulkTiers?.length > 0 ? data.bulkTiers : [{ quantity: data.quantity || 10, price: data.price || '' }]);
        } else {
          setMessage("❌ Product not found");
        }
      } catch (err) {
        console.error('Fetch product error:', err);
        setMessage("❌ Error fetching product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBulkTierChange = (index, field, value) => {
    setBulkTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  const addBulkTier = () => setBulkTiers(prev => [...prev, { quantity: '', price: '' }]);
  
  const removeBulkTier = (index) => {
    if (bulkTiers.length > 1) setBulkTiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    try {
      const imageUrls = await uploadMultipleToCloudinary(files);
      setProduct(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage('❌ Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('farmerToken');
      const response = await fetch(`${BASE_URL}products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          bulkTiers,
          price: bulkTiers[0]?.price || 0,
          quantity: bulkTiers.reduce((sum, tier) => sum + Number(tier.quantity), 0)
        })
      });

      if (response.ok) {
        setMessage('✅ Product updated successfully!');
        setTimeout(() => navigate('/farmer/products'), 1500);
      } else {
        setMessage('❌ Failed to update product');
      }
    } catch (error) {
      console.error('Update product error:', error);
      setMessage('❌ Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-green-700 mb-6">Update Product</h2>

        {message && (
          <div className={`p-3 mb-4 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={product.name} onChange={handleChange} required placeholder="Product Name" className="p-3 border rounded w-full" />
            <select name="category" value={product.category} onChange={handleChange} className="p-3 border rounded w-full">
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
            </select>
          </div>

          <textarea name="description" value={product.description} onChange={handleChange} rows="4" placeholder="Product Description" className="p-3 border rounded w-full" />

          {/* Location and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="location" value={product.location} onChange={handleChange} placeholder="Farm Location" className="p-3 border rounded w-full" />
            <select name="unit" value={product.unit} onChange={handleChange} className="p-3 border rounded w-full">
              <option value="kg">Kg</option>
              <option value="tons">Tons</option>
              <option value="pieces">Pieces</option>
              <option value="liters">Liters</option>
            </select>
          </div>

          {/* Bulk Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bulk Pricing</h3>
            {bulkTiers.map((tier, index) => (
              <div key={index} className="flex items-center gap-4 mb-3">
                <input
                  type="number"
                  value={tier.quantity}
                  placeholder={`Quantity (${product.unit})`}
                  onChange={(e) => handleBulkTierChange(index, 'quantity', Number(e.target.value))}
                  className="p-2 border rounded w-40"
                  required
                />
                <input
                  type="number"
                  value={tier.price}
                  placeholder={`Price / ${product.unit}`}
                  onChange={(e) => handleBulkTierChange(index, 'price', Number(e.target.value))}
                  className="p-2 border rounded w-40"
                  required
                />
                {index > 0 && (
                  <button type="button" onClick={() => removeBulkTier(index)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addBulkTier} className="flex items-center gap-2 text-green-600 mt-2">
              <Plus className="h-4 w-4" />
              Add More Tiers
            </button>
          </div>

          {/* Quality & Organic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="quality" value={product.quality} onChange={handleChange} className="p-3 border rounded w-full">
              <option value="Premium">Premium</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
            </select>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="organic" checked={product.organic} onChange={handleChange} />
              Organic Product
            </label>
          </div>

          {/* Harvest & Expiry Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="harvestDate" value={product.harvestDate} onChange={handleChange} className="p-3 border rounded w-full" />
            <input type="date" name="expiryDate" value={product.expiryDate || ''} onChange={handleChange} className="p-3 border rounded w-full" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <ImagePlus className="h-4 w-4" />
              Upload Images
            </label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="p-2 border rounded w-full" />
            <div className="flex flex-wrap gap-3 mt-4">
              {product.images?.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`img-${i}`} className="w-24 h-24 object-cover rounded border" />
                  <button onClick={() => removeImage(i)} type="button" className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs hover:bg-red-700">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-all"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProduct;

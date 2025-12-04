import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('farmerToken');
      const response = await fetch(
        `${API_BASE_URL}products/farmer/my-products`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('farmerToken');
      const response = await fetch(`${API_BASE_URL}products/${id}`, {
        method: 'DELETE',
        headers: {
          token: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading products...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-700">
          My Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium capitalize">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-bold text-green-600">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="font-medium">
                        {product.quantity} {product.unit}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Quality:</span>
                      <span className="font-medium">{product.quality}</span>
                    </div>

                    {product.organic && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Organic:</span>
                        <span className="text-green-600 font-medium">
                          ✓ Yes
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{product.location}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Harvest Date:</span>
                      <span className="font-medium">
                        {new Date(product.harvestDate).toLocaleDateString()}
                      </span>
                    </div>

                    {product.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Expiry Date:</span>
                        <span className="font-medium">
                          {new Date(product.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/update-product/${product._id}`)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 bg-green-100 text-green-800 py-2 px-3 rounded text-sm hover:bg-green-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default FarmerProducts;

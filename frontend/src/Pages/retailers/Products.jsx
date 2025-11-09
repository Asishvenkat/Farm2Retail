import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Eye, MapPin } from 'lucide-react';
import { BASE_URL } from '../../requestMethods';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Constants
const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Herbs'];
const priceRanges = [
  { label: 'All Prices', value: '' },
  { label: 'Under ₹50', value: '0-50' },
  { label: '₹50 - ₹100', value: '50-100' },
  { label: '₹100 - ₹200', value: '100-200' },
  { label: '₹200 - ₹500', value: '200-500' },
  { label: 'Above ₹500', value: '500-999999' }
];
const fallbackImage = 'https://images.unsplash.com/photo-1546470427-e8ff66c7ba6e?w=300&h=200&fit=crop';

// Product card component
const ProductCard = ({ product, onView }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden">
    <div className="relative">
      <img
        src={product.images?.[0] || fallbackImage}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = fallbackImage }}
      />
      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
        {product.category}
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
        <span className="text-sm text-gray-500">{product.quantity} kg</span>
      </div>
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <div className="flex items-center"><User className="h-4 w-4 mr-1" /> {product.farmerName}</div>
        <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {product.location}</div>
        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Harvested: {new Date(product.harvestDate).toLocaleDateString()}</div>
      </div>
      <button
        onClick={() => onView(product._id)}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
      >
        <Eye className="h-4 w-4 mr-2" /> View Details
      </button>
    </div>
  </div>
);

const ProductsListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', priceRange: '' });

  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('retailerToken');
      if (!token) {
        setError('Authentication required. Please login first.');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priceRange) params.append('priceRange', filters.priceRange);

      const response = await fetch(`${BASE_URL}products?${params}`, {
        method: 'GET',
        headers: { token: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 401) return setError('Session expired. Please login again.');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.priceRange]);

  useEffect(() => {
    const search = debouncedSearch.toLowerCase();
    const result = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.farmerName.toLowerCase().includes(search) ||
      p.location.toLowerCase().includes(search)
    );
    setFilteredProducts(result);
  }, [debouncedSearch, products]);

  const handleFilterChange = (type, value) => setFilters(prev => ({ ...prev, [type]: value }));
  const clearFilters = () => { setFilters({ category: '', priceRange: '' }); setSearchTerm(''); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <button onClick={fetchProducts} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Fresh Products</h1>
          <p className="text-gray-600 mt-2">Discover fresh produce from local farmers</p>
        </div>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by product, farmer, or city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={filters.priceRange}
              onChange={e => handleFilterChange('priceRange', e.target.value)}
              className="px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500"
            >
              {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            <button onClick={clearFilters} className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100">
              Clear Filters
            </button>
          </div>

          {/* Product Count */}
          <p className="text-gray-600 mb-6">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p._id} product={p} onView={(id) => navigate(`/product/${id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsListing;

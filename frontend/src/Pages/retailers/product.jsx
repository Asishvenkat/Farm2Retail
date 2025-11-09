import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../redux/cartRedux';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistRedux';
import { ArrowLeft, Heart, ShoppingCart, MapPin, Calendar, User, Package, Plus, Minus, MessageCircle } from 'lucide-react';
import { BASE_URL, publicRequest } from '../../requestMethods';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import socketService from '../../socketService';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);
  const [quantityMultiple, setQuantityMultiple] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wishlist = useSelector((state) => state.wishlist.products);
  const currentUser = useSelector((state) => state.user.currentUser);
  const isWishlisted = wishlist.some((item) => item._id === product?._id);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
    } catch {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);
  useEffect(() => { setQuantityMultiple(1); }, [selectedTierIndex]);

  const tier = product?.bulkTiers?.[selectedTierIndex];
  const finalQty = tier ? tier.quantity * quantityMultiple : 0;
  const totalPrice = tier ? finalQty * tier.price : 0;

  const handleQtyChange = (inc) => setQuantityMultiple(prev => Math.max(1, prev + inc));

  const handleAddToCart = () => {
    if (!tier) return alert('Please select quantity');
    dispatch(addProduct({
      _id: product._id,
      title: product.name,
      name: product.name,
      price: tier.price,
      quantity: finalQty,
      img: product.images?.[0],
      farmerName: product.farmerName,
      size: `${finalQty} ${product.unit}`,
      totalPrice,
      bulkQuantity: tier.quantity,
      unit: product.unit
    }));
    alert(`✅ Added ${finalQty} ${product.unit} of ${product.name} to cart!`);
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        name: product.name,
        img: product.images?.[0],
        price: tier?.price || 0,
        farmerName: product.farmerName,
        location: product.location,
        unit: product.unit,
        category: product.category,
        size: `${tier?.quantity || 1} ${product.unit}`
      }));
    }
  };

  const handleMessageFarmer = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!product.farmerId) {
      alert('Farmer information not available');
      return;
    }

    try {
      // Get token from Redux store
      const token = currentUser.accessToken;

      // Check if conversation already exists
      const checkResponse = await axios.get(
        `${BASE_URL}messages/check-conversation/${currentUser._id}/${product.farmerId}`,
        {
          headers: {
            token: `Bearer ${token}`
          }
        }
      );

      // If conversation exists, just navigate to messages page
      if (checkResponse.data.exists) {
        navigate('/messages', { 
          state: { 
            selectedUserId: product.farmerId,
            userName: product.farmerName 
          } 
        });
        return;
      }

      // If conversation doesn't exist, create initial message
      const messageData = {
        senderId: currentUser._id,
        receiverId: product.farmerId,
        message: `Hi ${product.farmerName}! I'm interested in your ${product.name}. Can we discuss bulk pricing for ${tier?.quantity || product.quantity} ${product.unit}?`,
        timestamp: new Date(),
      };

      // Send via socket
      socketService.emit('chat:sendMessage', messageData);

      // Save to database with authentication
      await axios.post(`${BASE_URL}messages`, messageData, {
        headers: {
          token: `Bearer ${token}`
        }
      });

      // Navigate to messages with the selected conversation
      navigate('/messages', { 
        state: { 
          selectedUserId: product.farmerId,
          userName: product.farmerName 
        } 
      });
    } catch (error) {
      console.error('Error contacting farmer:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || "Not Found"}</div>;

  const hasTiers = product.bulkTiers?.length;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <button onClick={() => window.history.back()} className="text-gray-600 mb-4 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images & Description */}
          <div>
            <div className="w-full aspect-square rounded-lg overflow-hidden border">
              <img src={product.images?.[selectedImage]} alt={product.name} className="w-full h-full object-contain" />
            </div>

            {product.images?.length > 1 && (
              <div className="flex space-x-2 mt-3">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-md cursor-pointer object-cover border-2 ${selectedImage === i ? 'border-green-600' : 'border-gray-300'}`}
                    alt={`thumbnail-${i}`}
                  />
                ))}
              </div>
            )}

            {product.description && (
              <div className="mt-4">
                <h2 className="font-semibold text-lg mb-1">Description</h2>
                <p className="text-gray-700 text-sm">{product.description}</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <button onClick={toggleWishlist} className="text-red-500">
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="text-sm space-x-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{product.category}</span>
              {product.organic && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Organic</span>}
            </div>

            {tier && (
              <div>
                <p className="text-green-700 text-xl font-bold">₹{tier.price} <span className="text-sm text-gray-500">per {product.unit}</span></p>
                <p className="text-gray-700 text-sm">Total: ₹{totalPrice.toFixed(2)} ({finalQty} {product.unit})</p>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg text-sm flex justify-between items-center">
              <div>
                <p className="font-semibold flex items-center"><User className="w-4 h-4 mr-1" /> {product.farmerName}</p>
                <p className="flex items-center text-blue-700"><MapPin className="w-4 h-4 mr-1" /> {product.location}</p>
              </div>
              <button 
                onClick={handleMessageFarmer} 
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-xs flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <p className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Harvest: {new Date(product.harvestDate).toLocaleDateString()}</p>
              <p className="flex items-center"><Package className="w-4 h-4 mr-1" /> Stock: {product.bulkTiers?.reduce((sum, t) => sum + t.quantity, 0)} {product.unit}</p>
            </div>

            {hasTiers ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Select Quantity</h3>
                  {product.bulkTiers.map((t, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`p-3 border rounded-lg mb-2 cursor-pointer ${selectedTierIndex === idx ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>{t.quantity} {product.unit} @ ₹{t.price}</div>
                        <div className="font-semibold">₹{(t.quantity * t.price).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border p-3 rounded-lg bg-gray-50">
                  <div className="text-sm">
                    {quantityMultiple > 1 && <p>{quantityMultiple} × {tier.quantity} = <b>{finalQty} {product.unit}</b></p>}
                    <p className="text-gray-600">Final Total: ₹{totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleQtyChange(-1)} disabled={quantityMultiple <= 1} className="p-1 border rounded disabled:opacity-50"><Minus /></button>
                    <span className="font-bold">{quantityMultiple}</span>
                    <button onClick={() => handleQtyChange(1)} className="p-1 border rounded"><Plus /></button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={handleAddToCart} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"><ShoppingCart className="w-4 h-4 mr-1" /> Add</button>
                  <button onClick={() => { handleAddToCart(); window.location.href = '/cart'; }} className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">Buy Now</button>
                </div>
              </>
            ) : (
              <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm">
                <p>No bulk quantities available.</p>
                <p>Contact the farmer directly for pricing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;

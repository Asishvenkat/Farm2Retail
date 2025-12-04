import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../requestMethods';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = user?.accessToken;

      console.log('Fetching orders for farmer:', user._id);

      // Fetch farmer-specific orders with populated details
      const response = await axios.get(`${BASE_URL}orders/farmer/${user._id}`, {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      console.log('Orders received:', response.data);
      console.log('Number of orders:', response.data.length);

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'completed':
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={18} />;
      case 'completed':
      case 'delivered':
        return <CheckCircle size={18} />;
      case 'cancelled':
        return <XCircle size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (filter === 'all') return true;
      if (filter === 'completed') {
        // Include both 'completed' and 'delivered' in the completed section
        return (
          order.status?.toLowerCase() === 'completed' ||
          order.status?.toLowerCase() === 'delivered'
        );
      }
      return order.status?.toLowerCase() === filter;
    })
    .sort((a, b) => {
      // Sort by date: latest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
            <p style={{ fontSize: '18px', color: '#666' }}>Loading orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '80vh',
          padding: '40px 20px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                color: '#00796b',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Package size={32} />
              Orders Received
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Track and manage orders from retailers for your products
            </p>
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            {['all', 'pending', 'completed', 'cancelled'].map((status) => {
              // Calculate count based on filter type
              let count;
              if (status === 'all') {
                count = orders.length;
              } else if (status === 'completed') {
                // Include both completed and delivered in the completed count
                count = orders.filter(
                  (o) =>
                    o.status?.toLowerCase() === 'completed' ||
                    o.status?.toLowerCase() === 'delivered'
                ).length;
              } else {
                count = orders.filter(
                  (o) => o.status?.toLowerCase() === status
                ).length;
              }

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '10px 20px',
                    border:
                      filter === status
                        ? '2px solid #00796b'
                        : '2px solid #ddd',
                    background: filter === status ? '#00796b' : 'white',
                    color: filter === status ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s',
                  }}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div
              style={{
                background: 'white',
                padding: '60px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Package
                size={64}
                color="#ccc"
                style={{ marginBottom: '20px' }}
              />
              <h3 style={{ color: '#666', marginBottom: '10px' }}>
                No {filter !== 'all' ? filter : ''} orders found
              </h3>
              <p style={{ color: '#999' }}>
                Orders from retailers will appear here
              </p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: `5px solid ${getStatusColor(order.status)}`,
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '15px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#999',
                          marginBottom: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Calendar size={16} />
                        {formatDate(order.createdAt)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        Order ID: {order._id}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '8px 16px',
                        background: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {getStatusIcon(order.status)}
                      {order.status || 'Pending'}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: '10px',
                        color: '#333',
                        fontSize: '16px',
                      }}
                    >
                      Customer Details
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '10px',
                      }}
                    >
                      {order.customer && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#666',
                            }}
                          >
                            <User size={16} />
                            <span>{order.customer.username}</span>
                          </div>
                          {order.customer.phone && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#666',
                              }}
                            >
                              <Phone size={16} />
                              <span>{order.customer.phone}</span>
                            </div>
                          )}
                          {order.customer.email && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#666',
                              }}
                            >
                              <span style={{ fontSize: '14px' }}>
                                {order.customer.email}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {order.address && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#666',
                            gridColumn: '1 / -1',
                          }}
                        >
                          <MapPin size={16} />
                          <span>
                            {order.address.street}, {order.address.city},{' '}
                            {order.address.state} - {order.address.pincode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div style={{ marginBottom: '15px' }}>
                    <h4
                      style={{
                        marginBottom: '15px',
                        color: '#333',
                        fontSize: '16px',
                      }}
                    >
                      Products Ordered
                    </h4>
                    {order.products
                      .filter(
                        (item) =>
                          item.productDetails &&
                          item.productDetails.farmerId === user._id
                      )
                      .map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '10px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                              flex: 1,
                            }}
                          >
                            {item.productDetails.images &&
                              item.productDetails.images[0] && (
                                <img
                                  src={item.productDetails.images[0]}
                                  alt={item.productDetails.name}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                  }}
                                />
                              )}
                            <div>
                              <div
                                style={{
                                  fontWeight: '600',
                                  color: '#333',
                                  marginBottom: '4px',
                                }}
                              >
                                {item.productDetails.name}
                              </div>
                              <div style={{ fontSize: '14px', color: '#666' }}>
                                Quantity: {item.quantity}{' '}
                                {item.productDetails.unit}
                              </div>
                              <div
                                style={{
                                  fontSize: '13px',
                                  color: '#999',
                                  marginTop: '2px',
                                }}
                              >
                                Price per {item.productDetails.unit}: ₹
                                {item.productDetails.price}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontWeight: '700',
                              color: '#00796b',
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            ₹{item.productDetails.price * item.quantity}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Total Amount */}
                  <div
                    style={{
                      borderTop: '2px solid #eee',
                      paddingTop: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      Total Amount
                    </span>
                    <span
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#00796b',
                      }}
                    >
                      ₹{order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FarmerOrders;

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { mobile } from '../../responsive';
import { format } from 'date-fns';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

// Styled Components
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
`;

const OrderCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #fdfdfd;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Status = styled.div`
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  color: white;
  background-color: ${({ $status }) =>
    $status === 'delivered'
      ? '#4caf50'
      : $status === 'delivering'
        ? '#ff9800'
        : $status === 'pending'
          ? '#9e9e9e'
          : '#f44336'};
  height: fit-content;
`;

const InfoText = styled.span`
  color: #666;
  font-size: 14px;
`;

const BoldText = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const ProductCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f8f8f8;
  }
  ${mobile({
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'left',
  })}
`;

const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #f0f0f0;
`;

const ProductPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  flex: 1;
  ${mobile({ alignItems: 'center' })}
`;

const ProductInfoItem = ({ label, value }) =>
  value ? (
    <InfoText>
      <strong>{label}:</strong> {value}
    </InfoText>
  ) : null;

const ErrorBox = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((state) => state.user?.currentUser);
  const token = user?.accessToken;

  const fetchOrders = async () => {
    if (!user?._id || !token) {
      setError('Please login to view your orders');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}orders/find/${user._id}`, {
        headers: { token: `Bearer ${token}` },
      });

      const enrichedOrders = await Promise.all(
        res.data.map(async (order) => {
          const products = await Promise.all(
            order.products.map(async (item) => {
              try {
                const pRes = await axios.get(
                  `${API_BASE_URL}products/${item.productId}`
                );
                const data = pRes.data;
                return {
                  _id: data._id,
                  title: data.name || data.title || 'Unknown Product',
                  img: data.images?.[0] || data.img,
                  price: data.price,
                  quantity: item.quantity,
                  category: data.category,
                  unit: data.unit,
                };
              } catch {
                return {
                  _id: item.productId,
                  title: 'Product Not Available',
                  img: null,
                  quantity: item.quantity,
                  notFound: true,
                };
              }
            })
          );
          return { ...order, products };
        })
      );

      setOrders(
        enrichedOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } catch (e) {
      console.error('Error fetching orders:', e);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, token]);

  const totalPrice = (p) => (p.price || 0) * (p.quantity || 1);

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>MY ORDERS</Title>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <ErrorBox>{error}</ErrorBox>
        ) : orders.length === 0 ? (
          <EmptyState>
            <h2>No Orders Found</h2>
            <p>You haven&apos;t placed any orders yet.</p>
            <Button onClick={() => (window.location.href = '/')}>
              START SHOPPING
            </Button>
          </EmptyState>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <OrderDetails>
                  <BoldText>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </BoldText>
                  <InfoText>
                    Placed on {format(new Date(order.createdAt), 'PPP')}
                  </InfoText>
                  <BoldText>Total: ₹{order.amount}</BoldText>
                </OrderDetails>
                <Status $status={order.status}>{order.status}</Status>
              </OrderHeader>

              {order.products.map((product, i) => (
                <ProductCard
                  key={i}
                  onClick={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                >
                  {product.img && !product.notFound ? (
                    <ProductImage src={product.img} alt={product.title} />
                  ) : (
                    <ProductPlaceholder>
                      {product.notFound ? 'Unavailable' : 'No Image'}
                    </ProductPlaceholder>
                  )}
                  <ProductInfo>
                    <BoldText>{product.title}</BoldText>
                    <ProductInfoItem
                      label="Quantity"
                      value={`${product.quantity} ${product.unit || ''}`}
                    />
                    <ProductInfoItem
                      label="Category"
                      value={product.category}
                    />
                    {!product.notFound && (
                      <ProductInfoItem
                        label="Total"
                        value={`₹${totalPrice(product)}`}
                      />
                    )}
                    <InfoText style={{ color: '#007bff', fontSize: '13px' }}>
                      View Product →
                    </InfoText>
                  </ProductInfo>
                </ProductCard>
              ))}
            </OrderCard>
          ))
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Orders;

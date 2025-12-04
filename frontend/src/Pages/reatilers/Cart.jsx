import { Add, Remove } from '@mui/icons-material';
import styled from 'styled-components';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { mobile } from '../../responsive';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../../redux/cartRedux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div``;
const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: '10px' })}
`;
const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;
const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === 'filled' && 'none'};
  background-color: ${(props) =>
    props.type === 'filled' ? 'black' : 'transparent'};
  color: ${(props) => props.type === 'filled' && 'white'};
`;
const TopTexts = styled.div`
  ${mobile({ display: 'none' })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;
const Info = styled.div`
  flex: 3;
`;
const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;
const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;
const Image = styled.img`
  width: 200px;
`;
const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ProductName = styled.span``;
const ProductId = styled.span``;
const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;
const ProductSize = styled.span``;
const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: '5px 15px' })}
`;
const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: '20px' })}
`;
const QuantityButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }
`;
const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;
const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;
const SummaryTitle = styled.h1`
  font-weight: 200;
`;
const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === 'total' && '500'};
  font-size: ${(props) => props.type === 'total' && '24px'};
`;
const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

// Minimal Address Modal Styles
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user?.currentUser);
  const isLoggedIn = currentUser !== null;

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const proceedToPayment = async () => {
    try {
      const orderUrl = 'http://localhost:5000/api/payment/order';
      const { data } = await axios.post(orderUrl, {
        amount: cart.total * 100,
        currency: 'INR',
      });

      const options = {
        key: 'rzp_test_7iWVVTng1uWfu6',
        amount: data.amount,
        currency: data.currency,
        name: 'E-Commerce Store',
        description: 'Order Payment',
        order_id: data.id,
        handler: async function (response) {
          try {
            const res = await axios.post(
              'http://localhost:5000/api/payment/order/validate',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (res.data.msg === 'success') {
              try {
                const orderProducts = cart.products.map((product) => ({
                  productId: product._id,
                  quantity: product.quantity,
                }));

                const orderData = {
                  userId: currentUser._id,
                  products: orderProducts,
                  amount: cart.total,
                  address: address,
                  status: 'pending',
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                };

                await axios.post(
                  'http://localhost:5000/api/orders',
                  orderData,
                  {
                    headers: {
                      token: currentUser.accessToken,
                      'Content-Type': 'application/json',
                    },
                  }
                );

                dispatch(clearCart());
                navigate('/', { replace: true });
              } catch (orderError) {
                console.error('Order save failed:', orderError);
                alert(
                  'Order placement failed, but payment was successful. Please contact support.'
                );
              }
            } else {
              alert('Payment verification failed! Please contact support.');
            }
          } catch (validationError) {
            alert('Payment validation failed! Please contact support.');
          }
        },
        prefill: {
          name: address.name,
          email: currentUser?.email || '',
          contact: address.phone,
        },
        theme: { color: '#000000' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed. Please try again.');
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleAddressSubmit = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert('Please fill all address fields');
      return;
    }
    setShowModal(false);
    proceedToPayment();
  };

  // Updated handlers to pass bulk quantity
  const handleAddQuantity = (product) => {
    dispatch(
      increaseQuantity({
        id: product._id,
        size: product.size,
        color: product.color,
        bulkQuantity: product.bulkQuantity || 1, // Pass the bulk quantity
      })
    );
  };

  const handleRemoveQuantity = (product) => {
    dispatch(
      decreaseQuantity({
        id: product._id,
        size: product.size,
        color: product.color,
        bulkQuantity: product.bulkQuantity || 1, // Pass the bulk quantity
      })
    );
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (!cart.products || cart.products.length === 0) {
    return (
      <Container>
        <Navbar />
        <Wrapper>
          <Title>YOUR BAG IS EMPTY</Title>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              Looks like you haven&apos;t added anything to your bag yet.
            </p>
            <TopButton onClick={handleContinueShopping}>
              START SHOPPING
            </TopButton>
          </div>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={handleContinueShopping}>
            CONTINUE SHOPPING
          </TopButton>
          <TopButton type="filled" onClick={handleCheckout}>
            CHECKOUT NOW
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cart.products.map((product) => (
              <Product key={`${product._id}-${product.size}-${product.color}`}>
                <ProductDetail>
                  <Image src={product.img} alt={product.title} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product.title}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {product._id}
                    </ProductId>
                    <ProductColor color={product.color} />
                    <ProductSize>
                      <b>Size:</b> {product.size}
                    </ProductSize>
                    {/* Show bulk quantity info */}
                    {product.bulkQuantity && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        <b>Bulk Size:</b> {product.bulkQuantity} {product.unit}
                      </span>
                    )}
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <QuantityButton onClick={() => handleAddQuantity(product)}>
                      <Add />
                    </QuantityButton>
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <QuantityButton
                      onClick={() => handleRemoveQuantity(product)}
                    >
                      <Remove />
                    </QuantityButton>
                  </ProductAmountContainer>
                  <ProductPrice>
                    ₹ {product.price * product.quantity}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr />
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>₹ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>₹ 50</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>₹ -50</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>₹ {cart.total}</SummaryItemPrice>
            </SummaryItem>
            <Button onClick={handleCheckout}>CHECKOUT NOW</Button>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>
              Shipping Address
            </h3>
            <Input
              placeholder="Full Name*"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />
            <Input
              placeholder="Phone*"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <Input
              placeholder="Street Address*"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input
                placeholder="City*"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <Input
                placeholder="State*"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
              />
            </div>
            <Input
              placeholder="Pincode*"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Button
                style={{ flex: 1, background: '#f0f0f0', color: 'black' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button style={{ flex: 1 }} onClick={handleAddressSubmit}>
                Proceed
              </Button>
            </div>
          </ModalBox>
        </Modal>
      )}
    </Container>
  );
};

export default Cart;

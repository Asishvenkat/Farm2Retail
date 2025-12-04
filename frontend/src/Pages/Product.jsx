import { Add, Remove, Favorite, FavoriteBorder } from '@mui/icons-material';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import { mobile } from '../responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { publicRequest, BASE_URL } from '../requestMethods';
import axios from 'axios';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistRedux';
import { addProduct } from '../redux/cartRedux'; // Simplified import
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../socketService';

// ... (keep all your styled components as they are)
const Container = styled.div``;
const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  gap: 40px;
  ${mobile({ padding: '10px', flexDirection: 'column' })}
`;
const ImgContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Image = styled.img`
  width: 90%;
  height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  ${mobile({ height: '30vh', width: '100%' })}
`;
const WishlistBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
  &:hover {
    transform: scale(1.1);
  }
  ${mobile({ width: '40px', height: '40px', top: '10px', right: '10px' })}
`;
const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${mobile({ padding: '10px' })}
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const Title = styled.h1`
  font-weight: 600;
  font-size: 36px;
  margin: 0;
`;
const MobileWishlistBtn = styled.div`
  display: none;
  ${mobile({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  })}
  &:hover {
    transform: scale(1.1);
  }
`;
const Desc = styled.p`
  margin: 20px 0px;
  font-size: 20px;
  color: #555;
  line-height: 1.6;
`;
const Price = styled.span`
  font-weight: 500;
  font-size: 36px;
`;
const FilterContainer = styled.div`
  width: 100%;
  margin: 30px 0px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
`;
const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const FilterTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
`;
const FilterColor = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
  cursor: pointer;
  border: 2px solid ${(p) => (p.selected ? '#1a73e8' : '#ccc')};
  transition: all 0.3s ease;
  transform: ${(p) => (p.selected ? 'scale(1.1)' : 'scale(1)')};
  &:hover {
    border-color: #1a73e8;
    transform: scale(1.1);
  }
`;
const FilterSize = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;
`;
const AddContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;
const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;
const Amount = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  ${mobile({ width: '100%', justifyContent: 'space-between' })}
`;
const Button = styled.button`
  padding: 15px 30px;
  border: none;
  background-color: teal;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #006666;
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  ${mobile({ flex: '1' })}
`;
const ContactSellerButton = styled.button`
  padding: 15px 30px;
  border: 2px solid teal;
  background-color: white;
  color: teal;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover {
    background-color: teal;
    color: white;
    transform: translateY(-2px);
  }
  ${mobile({ flex: '1' })}
`;
const WishlistBtnLarge = styled.button`
  padding: 15px;
  border: 2px solid ${(p) => (p.inWishlist ? '#e74c3c' : '#ccc')};
  background-color: ${(p) => (p.inWishlist ? '#e74c3c' : 'white')};
  color: ${(p) => (p.inWishlist ? 'white' : '#666')};
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  &:hover {
    background-color: ${(p) => (p.inWishlist ? '#c0392b' : '#f8f9fa')};
    transform: translateY(-2px);
  }
  ${mobile({ display: 'none' })}
`;

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split('/')[2];
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.products);
  const currentUser = useSelector((state) => state.user.currentUser);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get('/products/find/' + id);
        setProduct(res.data);
        if (res.data.color?.length > 0) setColor(res.data.color[0]);
        if (res.data.size?.length > 0) setSize(res.data.size[0]);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    getProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === 'dec') {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addProduct({
        ...product,
        quantity: quantity,
        size: size,
        color: color,
      })
    );
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({ ...product, color, size }));
    }
  };

  const handleContactSeller = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!product.userId) {
      alert('Seller information not available');
      return;
    }

    try {
      // Get token from Redux store
      const token = currentUser.accessToken;

      // Check if conversation already exists
      const checkResponse = await axios.get(
        `${BASE_URL}messages/check-conversation/${currentUser._id}/${product.userId}`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );

      // If conversation exists, just navigate to messages page
      if (checkResponse.data.exists) {
        navigate('/messages', {
          state: {
            selectedUserId: product.userId,
            userName: product.title,
          },
        });
        return;
      }

      // If conversation doesn't exist, create initial message
      const messageData = {
        senderId: currentUser._id,
        receiverId: product.userId,
        message: `Hi! I'm interested in your product: ${product.title}`,
        timestamp: new Date(),
      };

      // Send initial message via socket
      socketService.emit('chat:sendMessage', messageData);

      // Save to database with authentication
      await axios.post(`${BASE_URL}messages`, messageData, {
        headers: {
          token: `Bearer ${token}`,
        },
      });

      // Navigate to messages page with selected conversation
      navigate('/messages', {
        state: {
          selectedUserId: product.userId,
          userName: product.title,
        },
      });
    } catch (error) {
      console.error('Error contacting seller:', error);
      alert('Failed to contact seller. Please try again.');
    }
  };

  return (
    <Container>
      <Announcement />
      <Navbar />
      <Wrapper>
        <ImgContainer>
          <Image src={product.img} />
        </ImgContainer>
        <InfoContainer>
          <TitleContainer>
            <Title>{product.title}</Title>
            <MobileWishlistBtn onClick={handleWishlistToggle}>
              {isInWishlist ? (
                <Favorite style={{ color: '#e74c3c', fontSize: '20px' }} />
              ) : (
                <FavoriteBorder style={{ color: '#666', fontSize: '20px' }} />
              )}
            </MobileWishlistBtn>
          </TitleContainer>
          <Desc>{product.desc}</Desc>
          <Price>₹{product.price}</Price>
          <FilterContainer>
            <Filter>
              <FilterTitle>Color:</FilterTitle>
              {product.color?.map((c) => (
                <FilterColor
                  color={c}
                  key={c}
                  selected={color === c}
                  onClick={() => setColor(c)}
                />
              ))}
            </Filter>
            <Filter>
              <FilterTitle>Size:</FilterTitle>
              <FilterSize
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {product.size?.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </FilterSize>
            </Filter>
          </FilterContainer>
          <AddContainer>
            <AmountContainer>
              <Remove
                onClick={() => handleQuantity('dec')}
                style={{ cursor: 'pointer' }}
              />
              <Amount>{quantity}</Amount>
              <Add
                onClick={() => handleQuantity('inc')}
                style={{ cursor: 'pointer' }}
              />
            </AmountContainer>
            <ButtonContainer>
              <Button onClick={handleAddToCart}>ADD TO CART</Button>
              <ContactSellerButton onClick={handleContactSeller}>
                CONTACT SELLER
              </ContactSellerButton>
              <WishlistBtnLarge
                inWishlist={isInWishlist}
                onClick={handleWishlistToggle}
              >
                {isInWishlist ? (
                  <Favorite style={{ fontSize: '20px' }} />
                ) : (
                  <FavoriteBorder style={{ fontSize: '20px' }} />
                )}
              </WishlistBtnLarge>
            </ButtonContainer>
          </AddContainer>
        </InfoContainer>
      </Wrapper>
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default Product;

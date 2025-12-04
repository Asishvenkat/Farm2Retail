import {
  Search,
  ShoppingCartOutlined,
  FavoriteBorder,
  ChatBubbleOutline,
} from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mobile } from '../responsive';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/userRedux';
import Notifications from './Notifications';
import socketService from '../socketService';
import axios from 'axios';
import { BASE_URL } from '../requestMethods';

// Styled Components
const Container = styled.div`
  height: 70px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  ${mobile({ height: '60px' })}
`;

const Wrapper = styled.div`
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: '10px 15px', flexDirection: 'column', gap: '10px' })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  font-weight: 700;
  font-size: 28px;
  color: #00796b;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #004d40;
  }
  ${mobile({ fontSize: '22px' })}
`;

const Center = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  ${mobile({ width: '100%', justifyContent: 'center' })}
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f3f4;
  padding: 8px 16px;
  border-radius: 25px;
  box-shadow: inset 0 0 0 1px #ddd;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 400px;

  &:focus-within {
    box-shadow: 0 0 0 2px #00796b;
    background-color: #ffffff;
  }

  ${mobile({ maxWidth: '90%' })}
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flexWrap: 'wrap', justifyContent: 'center', gap: '10px' })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  color: #333;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #00796b;
    transform: scale(1.05);
  }
  ${mobile({ fontSize: '12px', marginLeft: '10px' })}
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const MessageBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
`;

const Navbar = () => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Connect to WebSocket when user logs in
  useEffect(() => {
    if (user) {
      socketService.connect(user._id);
      fetchUnreadCount();
    }
    return () => {
      if (user) {
        socketService.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Listen for new messages to update unread count
  useEffect(() => {
    if (user) {
      const handleNewMessage = (data) => {
        // Only increment if the message is for this user
        if (data.receiverId === user._id) {
          setUnreadMessageCount((prev) => prev + 1);
        }
      };

      socketService.on('chat:receiveMessage', handleNewMessage);

      return () => {
        socketService.off('chat:receiveMessage');
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const token = user.accessToken;
      const response = await axios.get(
        `${BASE_URL}messages/unread/${user._id}`,
        {
          headers: {
            token: `Bearer ${token}`,
          },
        }
      );
      setUnreadMessageCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('persist:root');
    navigate('/');
  };

  return (
    <Container>
      <Wrapper>
        <Left></Left>

        <Center>
          {/* <SearchContainer>
            <Input
              placeholder="Search category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search
              style={{ color: "#00796b", fontSize: 22, cursor: "pointer" }}
              onClick={handleSearch}
            />
          </SearchContainer> */}
          <StyledLink to="/">
            <Logo>AgroTrade</Logo>
          </StyledLink>
        </Center>

        <Right>
          {!user ? (
            <>
              <StyledLink to="/register">
                <MenuItem>REGISTER</MenuItem>
              </StyledLink>
              <StyledLink to="/login">
                <MenuItem>SIGN IN</MenuItem>
              </StyledLink>
            </>
          ) : (
            <>
              <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
              <StyledLink to="/orders">
                <MenuItem>MY ORDERS</MenuItem>
              </StyledLink>
              <StyledLink to="/messages">
                <MenuItem>
                  <IconWrapper>
                    <ChatBubbleOutline />
                    {unreadMessageCount > 0 && (
                      <MessageBadge>
                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                      </MessageBadge>
                    )}
                  </IconWrapper>
                </MenuItem>
              </StyledLink>
              <StyledLink to="/wishlist">
                <MenuItem>
                  <FavoriteBorder />
                </MenuItem>
              </StyledLink>
              <StyledLink to="/cart">
                <MenuItem>
                  <ShoppingCartOutlined />
                </MenuItem>
              </StyledLink>
              <MenuItem>
                <Notifications />
              </MenuItem>
            </>
          )}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;

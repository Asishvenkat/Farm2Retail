import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import socketService from '../socketService';
import { BASE_URL } from '../requestMethods';
import axios from 'axios';
import { Send, MessageCircle, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 80px;
  width: 100%;
  flex: 1;
`;

const Header = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MessagesLayout = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  height: 500px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
    margin-bottom: 50px;
  }
`;

const ConversationList = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ConversationHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const ConversationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.$active ? '#e3f2fd' : 'white'};
  
  &:hover {
    background-color: ${props => props.$active ? '#e3f2fd' : '#f5f5f5'};
  }
`;

const ConversationUser = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 5px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00796b, #004d40);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UnreadBadge = styled.span`
  background: #00796b;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatWindow = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const ChatUserName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const MessagesContainer = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f9f9f9;
  min-height: 0;
  max-height: 100%;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  align-self: ${props => props.$isSent ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isSent ? '#00796b' : 'white'};
  color: ${props => props.$isSent ? 'white' : '#333'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const InputContainer = styled.div`
  padding: 20px;
  padding-bottom: 40px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  align-items: center;
  background: white;
  flex-shrink: 0;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00796b;
  }
`;

const SendButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: #00796b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #004d40;
    transform: scale(1.05);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: scale(1);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 40px;
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

const EmptyStateText = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  color: #999;
`;

const FooterWrapper = styled.div`
  margin-top: auto;
  width: 100%;
`;

const Messages = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Helper function to get authenticated headers
  const getAuthHeaders = () => {
    const token = user?.accessToken;
    return {
      headers: {
        token: `Bearer ${token}`
      }
    };
  };

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}messages/conversations/${user._id}`, getAuthHeaders());
      
      // Transform the data to match our expected format
      const transformedConversations = response.data.map(conv => {
        // Get the other user's info from the lastMessage
        const otherUser = conv.lastMessage?.senderId?._id === user._id 
          ? conv.lastMessage?.receiverId 
          : conv.lastMessage?.senderId;
        
        return {
          userId: conv.partnerId,
          userName: otherUser?.username || 'Unknown User',
          userType: 'user', // Can be enhanced later
          lastMessage: conv.lastMessage?.message || 'No messages yet',
          unreadCount: conv.unreadCount || 0
        };
      });
      
      // Remove duplicates based on userId (extra safety)
      const uniqueConversations = transformedConversations.reduce((acc, current) => {
        const exists = acc.find(item => item.userId === current.userId);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setConversations(uniqueConversations);
      setLoading(false);

      // Auto-select conversation if navigated from product page
      if (location.state?.selectedUserId && !selectedConversation) {
        const targetConv = uniqueConversations.find(
          c => c.userId === location.state.selectedUserId
        );
        if (targetConv) {
          fetchMessages(targetConv.userId, targetConv.userName, targetConv.userType);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId, otherUserName, userType) => {
    try {
      if (!otherUserId || otherUserId === 'undefined') {
        console.error('Invalid otherUserId:', otherUserId);
        alert('Cannot load conversation: Invalid user ID');
        return;
      }
      
      const response = await axios.get(`${BASE_URL}messages/conversation/${user._id}/${otherUserId}`, getAuthHeaders());
      setMessages(response.data);
      setSelectedConversation({ userId: otherUserId, userName: otherUserName, userType });
      
      // Scroll to bottom instantly after setting messages (not smooth for initial load)
      setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      
      // Mark messages as read
      await markAsRead(otherUserId);
      
      // Update conversations to reflect read status
      fetchConversations();
    } catch (err) {
      console.error('Error fetching messages:', err);
      alert('Failed to load conversation. Please try again.');
    }
  };

  const markAsRead = async (senderId) => {
    try {
      await axios.put(`${BASE_URL}messages/read/${senderId}/${user._id}`, {}, getAuthHeaders());
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket
    socketService.connect();
    socketService.joinUser(user._id);

    // Listen for new messages
    const handleNewMessage = (data) => {
      if (selectedConversation && 
          (data.senderId === selectedConversation.userId || data.receiverId === selectedConversation.userId)) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
        
        // Mark as read if conversation is open
        if (data.senderId === selectedConversation.userId) {
          markAsRead(data.senderId);
        }
      }
      
      // Update conversations list
      fetchConversations();
    };

    socketService.on('chat:receiveMessage', handleNewMessage);

    fetchConversations();

    return () => {
      socketService.off('chat:receiveMessage');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      senderId: user._id,
      receiverId: selectedConversation.userId,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    try {
      // Send via socket for real-time delivery
      socketService.emit('chat:sendMessage', messageData);

      // Also save to database
      await axios.post(`${BASE_URL}messages`, messageData, getAuthHeaders());

      // Add to local messages
      setMessages(prev => [...prev, { ...messageData, _id: Date.now().toString() }]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'hh:mm a');
    } catch {
      return '';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Header>
          <Title>
            <MessageCircle size={32} />
            My Messages
          </Title>
        </Header>

        <MessagesLayout>
          <ConversationList>
            <ConversationHeader>
              Conversations ({conversations.length})
            </ConversationHeader>
            
            {loading ? (
              <EmptyState>
                <EmptyStateIcon>💬</EmptyStateIcon>
                <EmptyStateText>Loading...</EmptyStateText>
              </EmptyState>
            ) : conversations.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>💬</EmptyStateIcon>
                <EmptyStateText>No conversations yet</EmptyStateText>
                <EmptyStateSubtext>Start chatting with sellers or buyers!</EmptyStateSubtext>
              </EmptyState>
            ) : (
              conversations.map((conv) => (
                <ConversationItem
                  key={conv.userId}
                  $active={selectedConversation?.userId === conv.userId}
                  onClick={() => fetchMessages(conv.userId, conv.userName, conv.userType)}
                >
                  <ConversationUser>
                    <UserAvatar>{getInitials(conv.userName)}</UserAvatar>
                    <UserInfo>
                      <UserName>
                        {conv.userName}
                        {conv.unreadCount > 0 && (
                          <UnreadBadge>{conv.unreadCount}</UnreadBadge>
                        )}
                      </UserName>
                      <LastMessage>
                        {typeof conv.lastMessage === 'object' ? conv.lastMessage?.message : conv.lastMessage}
                      </LastMessage>
                    </UserInfo>
                  </ConversationUser>
                </ConversationItem>
              ))
            )}
          </ConversationList>

          <ChatWindow>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <UserAvatar>{getInitials(selectedConversation.userName)}</UserAvatar>
                  <ChatUserName>{selectedConversation.userName}</ChatUserName>
                </ChatHeader>

                <MessagesContainer>
                  {messages.map((msg, index) => {
                    // Handle both populated and unpopulated senderId
                    const messageSenderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                    const isSent = messageSenderId === user._id;
                    
                    return (
                      <MessageBubble key={msg._id || index} $isSent={isSent}>
                        <MessageText>
                          {typeof msg.message === 'object' ? JSON.stringify(msg.message) : msg.message}
                        </MessageText>
                        <MessageTime>
                          <Clock size={12} />
                          {formatTime(msg.timestamp || msg.createdAt)}
                        </MessageTime>
                      </MessageBubble>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </MessagesContainer>

                <InputContainer>
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                  />
                  <SendButton onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send size={20} />
                  </SendButton>
                </InputContainer>
              </>
            ) : (
              <EmptyState>
                <EmptyStateIcon>👈</EmptyStateIcon>
                <EmptyStateText>Select a conversation</EmptyStateText>
                <EmptyStateSubtext>Choose a conversation from the list to start chatting</EmptyStateSubtext>
              </EmptyState>
            )}
          </ChatWindow>
        </MessagesLayout>
      </Wrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </Container>
  );
};

export default Messages;

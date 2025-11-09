import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import styled from 'styled-components';
import socketService from '../socketService';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s;

  &:hover {
    background: #0056b3;
    transform: scale(1.1);
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 360px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: ${props => props.$show ? 'flex' : 'none'};
  flex-direction: column;
  z-index: 999;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: #007bff;
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa;
`;

const Message = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isMine ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  background: ${props => props.isMine ? '#007bff' : '#e9ecef'};
  color: ${props => props.isMine ? 'white' : 'black'};
  word-wrap: break-word;
`;

const MessageTime = styled.span`
  font-size: 10px;
  color: #999;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: #666;
  font-style: italic;
`;

const UserList = styled.div`
  padding: 16px;
`;

const UserItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #f8f9fa;
  }
`;

const UnreadBadge = styled.span`
  background: #ff4444;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: bold;
`;

const Chat = ({ recipientId, recipientName }) => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user && recipientId) {
      // Connect socket
      socketService.connect(user._id);
      
      // Load conversation
      loadConversation();
      
      // Listen for incoming messages
      socketService.onChatMessage((data) => {
        if (data.senderId === recipientId) {
          setMessages(prev => [...prev, {
            senderId: data.senderId,
            message: data.message,
            timestamp: data.timestamp,
            isMine: false
          }]);
        }
      });

      // Listen for typing indicator
      socketService.onUserTyping((data) => {
        if (data.userId === recipientId) {
          setIsTyping(data.isTyping);
        }
      });

      return () => {
        socketService.off('chat:receiveMessage');
        socketService.off('chat:userTyping');
      };
    }
  }, [user, recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;
      
      if (currentUser && recipientId) {
        const res = await axios.get(
          `${API_BASE_URL}messages/conversation/${currentUser._id}/${recipientId}`,
          {
            headers: { token: `Bearer ${currentUser.accessToken}` }
          }
        );
        
        setMessages(res.data.map(msg => ({
          senderId: msg.senderId._id,
          message: msg.message,
          timestamp: msg.createdAt,
          isMine: msg.senderId._id === currentUser._id
        })));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !recipientId) return;

    const messageData = {
      recipientId,
      message: message.trim(),
      senderId: user._id,
      senderName: user.username
    };

    // Optimistically add message
    setMessages(prev => [...prev, {
      senderId: user._id,
      message: message.trim(),
      timestamp: new Date(),
      isMine: true
    }]);

    // Send via socket
    socketService.sendMessage(messageData);

    // Save to database
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;
      
      if (currentUser) {
        await axios.post(
          `${API_BASE_URL}messages`,
          {
            senderId: user._id,
            receiverId: recipientId,
            message: message.trim()
          },
          {
            headers: { token: `Bearer ${currentUser.accessToken}` }
          }
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setMessage('');
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    if (user && recipientId) {
      socketService.sendTypingIndicator({
        recipientId,
        isTyping: e.target.value.length > 0,
        senderName: user.username
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!recipientId || !recipientName) {
    return null;
  }

  return (
    <>
      <ChatButton onClick={() => setShowChat(!showChat)}>
        <MessageCircle size={28} />
      </ChatButton>

      <ChatWindow $show={showChat}>
        <ChatHeader>
          <ChatTitle>Chat with {recipientName}</ChatTitle>
          <CloseButton onClick={() => setShowChat(false)}>
            <X size={20} />
          </CloseButton>
        </ChatHeader>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <Message key={index} isMine={msg.isMine}>
              <MessageBubble isMine={msg.isMine}>
                {msg.message}
              </MessageBubble>
              <MessageTime>
                {format(new Date(msg.timestamp), 'HH:mm')}
              </MessageTime>
            </Message>
          ))}
          {isTyping && (
            <TypingIndicator>{recipientName} is typing...</TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
          />
          <SendButton onClick={handleSendMessage} disabled={!message.trim()}>
            <Send size={18} />
          </SendButton>
        </InputContainer>
      </ChatWindow>
    </>
  );
};

export default Chat;

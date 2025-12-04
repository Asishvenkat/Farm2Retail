import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, User } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import socketService from '../../socketService';
import axios from 'axios';
import { format } from 'date-fns';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      socketService.connect(user._id);
      loadConversations();

      // Listen for new messages
      socketService.onChatMessage((data) => {
        if (selectedChat && data.senderId === selectedChat.userId) {
          setMessages((prev) => [
            ...prev,
            {
              senderId: data.senderId,
              message: data.message,
              timestamp: data.timestamp,
              isMine: false,
            },
          ]);
        }
        // Refresh conversations to show new message indicator
        loadConversations();
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user, selectedChat]);

  const loadConversations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}messages/conversations/${user._id}`
      );
      setConversations(res.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (otherUserId, otherUserName) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}messages/conversation/${user._id}/${otherUserId}`
      );
      setMessages(
        res.data.map((msg) => ({
          senderId: msg.senderId,
          message: msg.message,
          timestamp: msg.createdAt,
          isMine: msg.senderId === user._id,
        }))
      );
      setSelectedChat({ userId: otherUserId, userName: otherUserName });

      // Mark as read
      await axios.put(
        `${API_BASE_URL}messages/read/${otherUserId}/${user._id}`
      );
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      senderId: user._id,
      recipientId: selectedChat.userId,
      message: newMessage,
      senderName: user.username || user.name,
    };

    try {
      // Send via socket
      socketService.sendMessage(messageData);

      // Save to database
      await axios.post(`${API_BASE_URL}messages`, messageData);

      // Add to local messages
      setMessages((prev) => [
        ...prev,
        {
          senderId: user._id,
          message: newMessage,
          timestamp: new Date(),
          isMine: true,
        },
      ]);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow overflow-y-auto">
            <div className="p-4 bg-green-600 text-white font-semibold">
              Conversations
            </div>
            <div className="divide-y">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      loadMessages(conv.otherUserId, conv.otherUserName)
                    }
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.userId === conv.otherUserId
                        ? 'bg-green-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-green-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">
                          {conv.otherUserName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {conv.lastMessage}
                        </div>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-green-600 text-white font-semibold flex items-center">
                  <MessageCircle className="mr-2" size={20} />
                  Chat with {selectedChat.userName}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] ${msg.isMine ? 'order-2' : 'order-1'}`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            msg.isMine
                              ? 'bg-green-600 text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {format(new Date(msg.timestamp), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-green-600"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Messages;

import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import styled from 'styled-components';
import socketService from '../socketService';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const NotificationContainer = styled.div`
  position: relative;
`;

const BellIcon = styled.div`
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 50px;
  width: 360px;
  max-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: ${(props) => (props.$show ? 'block' : 'none')};
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background: ${(props) => (props.read ? '#fff' : '#f0f8ff')};
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const NotificationText = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: ${(props) => (props.read ? 'normal' : '600')};
  font-size: 14px;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: #999;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #999;
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 4px;

  ${(props) => {
    switch (props.type) {
      case 'NEW_ORDER':
        return 'background: #28a745; color: white;';
      case 'ORDER_STATUS_UPDATE':
        return 'background: #007bff; color: white;';
      case 'NEW_MESSAGE':
        return 'background: #17a2b8; color: white;';
      case 'PRICE_CHANGE':
        return 'background: #ffc107; color: black;';
      case 'PRODUCT_UPDATE':
        return 'background: #17a2b8; color: white;';
      case 'STOCK_UPDATE':
        return 'background: #fd7e14; color: white;';
      default:
        return 'background: #6c757d; color: white;';
    }
  }}
`;

const Notifications = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user) {
      // Connect to socket
      socketService.connect(user._id);

      // Fetch existing notifications
      fetchNotifications();

      // Listen for new notifications
      socketService.onNotification((notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(notification.message, {
            icon: '/logo.png',
            body: notification.message,
          });
        }
      });

      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;

      if (currentUser) {
        const res = await axios.get(
          `${API_BASE_URL}notifications/${currentUser._id}`,
          {
            headers: { token: `Bearer ${currentUser.accessToken}` },
          }
        );
        // Filter out NEW_MESSAGE notifications (they appear in message icon)
        const filteredNotifications = res.data.filter(
          (n) => n.type !== 'NEW_MESSAGE'
        );
        setNotifications(filteredNotifications);

        const unread = filteredNotifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;

      if (currentUser) {
        await axios.put(
          `${API_BASE_URL}notifications/${notificationId}/read`,
          {},
          {
            headers: { token: `Bearer ${currentUser.accessToken}` },
          }
        );

        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;

      if (currentUser) {
        await axios.put(
          `${API_BASE_URL}notifications/${currentUser._id}/read-all`,
          {},
          {
            headers: { token: `Bearer ${currentUser.accessToken}` },
          }
        );

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = JSON.parse(localStorage.getItem('persist:root'))?.user;
      const currentUser = token ? JSON.parse(token).currentUser : null;

      if (currentUser) {
        await axios.delete(`${API_BASE_URL}notifications/${notificationId}`, {
          headers: { token: `Bearer ${currentUser.accessToken}` },
        });

        // Remove notification from state
        setNotifications((prev) =>
          prev.filter((n) => n._id !== notificationId)
        );

        // Update unread count if notification was unread
        const notification = notifications.find(
          (n) => n._id === notificationId
        );
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate to relevant page if link exists
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <NotificationContainer>
      <BellIcon onClick={() => setShowDropdown(!showDropdown)}>
        <Bell size={24} />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>
        )}
      </BellIcon>

      <Dropdown $show={showDropdown}>
        <Header>
          <Title>Notifications</Title>
          {unreadCount > 0 && (
            <MarkAllRead onClick={markAllAsRead}>
              <Check size={14} style={{ marginRight: 4 }} />
              Mark all read
            </MarkAllRead>
          )}
        </Header>

        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>No notifications yet</EmptyState>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                read={notification.read}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationContent>
                  <NotificationText>
                    <TypeBadge type={notification.type}>
                      {notification.type.replace('_', ' ')}
                    </TypeBadge>
                    <NotificationTitle read={notification.read}>
                      {notification.title || notification.message}
                    </NotificationTitle>
                    <NotificationMessage>
                      {notification.message}
                    </NotificationMessage>
                    <NotificationTime>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </NotificationTime>
                  </NotificationText>
                  <CloseButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                  >
                    <X size={16} />
                  </CloseButton>
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      </Dropdown>
    </NotificationContainer>
  );
};

export default Notifications;

import { useState, useEffect, useRef } from 'react';
import { 
  FiBell, FiCheck, FiX, FiMail, FiBriefcase, FiCalendar, 
  FiMessageCircle, FiUserPlus, FiCheckCircle, FiFileText, FiAlertCircle
} from 'react-icons/fi';
import { 
  getUnreadNotifications, 
  getUnreadCount, 
  markNotificationRead, 
  markAllNotificationsRead,
  dismissNotification
} from '../../api/notifications.api';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch unread count on mount and every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUnreadNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await markNotificationRead(notification.id);
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Navigate to link if provided
      if (notification.link) {
        navigate(notification.link);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDismiss = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await dismissNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      job: FiBriefcase,
      event: FiCalendar,
      comment: FiMessageCircle,
      like: FiCheckCircle,
      connection: FiUserPlus,
      message: FiMail,
      announcement: FiAlertCircle,
      verification: FiCheckCircle,
      blog: FiFileText,
    };
    const Icon = iconMap[type] || FiBell;
    return <Icon className="w-5 h-5" />;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      job: 'text-blue-600 bg-blue-100',
      event: 'text-orange-600 bg-orange-100',
      comment: 'text-purple-600 bg-purple-100',
      like: 'text-pink-600 bg-pink-100',
      connection: 'text-cyan-600 bg-cyan-100',
      message: 'text-green-600 bg-green-100',
      announcement: 'text-yellow-600 bg-yellow-100',
      verification: 'text-green-600 bg-green-100',
      blog: 'text-indigo-600 bg-indigo-100',
    };
    return colorMap[type] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiCheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No new notifications</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.notification_type)}`}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {notification.time_ago} ago
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => handleDismiss(e, notification.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={() => {
                navigate('/notifications');
                setIsOpen(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

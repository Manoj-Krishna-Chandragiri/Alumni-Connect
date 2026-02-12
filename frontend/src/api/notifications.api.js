import axiosInstance from './axiosInstance';

/**
 * Notification API endpoints
 */

// Get all notifications for current user
export const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications/');
  return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async () => {
  const response = await axiosInstance.get('/notifications/unread/');
  return response.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/notifications/unread_count/');
  return response.data;
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  const response = await axiosInstance.post(`/notifications/${notificationId}/mark_read/`);
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.post('/notifications/mark_all_read/');
  return response.data;
};

// Dismiss/delete a notification
export const dismissNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}/dismiss/`);
  return response.data;
};

// Clear all read notifications
export const clearAllNotifications = async () => {
  const response = await axiosInstance.delete('/notifications/clear_all/');
  return response.data;
};

// Get notification preferences
export const getNotificationPreferences = async () => {
  const response = await axiosInstance.get('/notifications/preferences/my_preferences/');
  return response.data;
};

// Update notification preferences
export const updateNotificationPreferences = async (preferences) => {
  const response = await axiosInstance.put('/notifications/preferences/update_preferences/', preferences);
  return response.data;
};

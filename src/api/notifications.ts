
import { fetchWithAuth, handleResponse, handleFetchError } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  userId: string;
  createdAt: string;
  isRead: boolean;
}

// API functions for notifications
export const notificationsAPI = {
  // Get all notifications for the current user
  getUserNotifications: async (): Promise<{ notifications: Notification[] } | null> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications/user`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update notification status
  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Create a new notification (admin)
  createNotification: async (notificationData: { 
    title: string; 
    message: string; 
    type: string; 
    userId?: string; 
  }): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications`, {
        method: "POST",
        body: JSON.stringify(notificationData),
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

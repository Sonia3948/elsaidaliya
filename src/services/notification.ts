
import { getAuthToken, handleResponse, handleFetchError, fetchWithAuth } from "./common";

const API_URL = "http://localhost:8080/api";

export const notificationService = {
  // Get all notifications for the current user
  getUserNotifications: async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/notifications/user`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Mark a notification as read
  markAsRead: async (id: string) => {
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
  updateStatus: async (id: string, status: string) => {
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
};

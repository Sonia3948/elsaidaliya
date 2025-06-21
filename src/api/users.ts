
import { fetchWithAuth, handleResponse, handleFetchError } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface PendingUser {
  id: string;
  businessName: string;
  role: string;
  createdAt: string;
  email?: string;
  phone?: string;
}

// API functions for pending users
export const pendingUsersAPI = {
  // Get all pending users
  getPendingUsers: async (): Promise<{ users: PendingUser[] } | null> => {
    try {
      console.log("Fetching pending users...");
      
      const response = await fetchWithAuth(`${API_URL}/users/pending`);
      const data = await handleResponse(response);
      
      console.log("Pending users response:", data);
      return data;
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Approve a user
  approveUser: async (userId: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: true }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Reject a user
  rejectUser: async (userId: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: false }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

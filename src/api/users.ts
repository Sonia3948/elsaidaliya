
import { fetchWithAuth, handleResponse, handleFetchError } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface PendingUser {
  id: string;
  businessName: string;
  role: string;
  email?: string;
  createdAt: string;
}

export interface PendingUsersResponse {
  users: PendingUser[];
  total: number;
}

export const pendingUsersAPI = {
  // Get all pending users
  getPendingUsers: async (): Promise<PendingUsersResponse | null> => {
    try {
      console.log("Fetching pending users...");
      const response = await fetchWithAuth(`${API_URL}/users/pending`);
      const data = await handleResponse(response);
      console.log("Pending users response:", data);
      return data;
    } catch (error) {
      console.error("Error in getPendingUsers:", error);
      return handleFetchError(error);
    }
  },

  // Approve a pending user
  approveUser: async (userId: string): Promise<any> => {
    try {
      console.log("Approving user:", userId);
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/approve`, {
        method: "PUT"
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error approving user:", error);
      return handleFetchError(error);
    }
  },

  // Reject a pending user
  rejectUser: async (userId: string): Promise<any> => {
    try {
      console.log("Rejecting user:", userId);
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/reject`, {
        method: "DELETE"
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error rejecting user:", error);
      return handleFetchError(error);
    }
  }
};

// General users API
export const usersAPI = {
  // Get all users
  getUsers: async (): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update user
  updateUser: async (userId: string, userData: any): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData)
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}`, {
        method: "DELETE"
      });
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};


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

export interface User {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  role: string;
  isActive: boolean;
  subscription?: string;
  subExpiry?: string;
  createdAt: string;
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

// API functions for general user management
export const usersAPI = {
  // Get all users (admin)
  getAllUsers: async (filters: Record<string, string> = {}): Promise<{ users: User[] } | null> => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_URL}/users${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get featured suppliers (public endpoint)
  getFeaturedSuppliers: async (): Promise<{ users: User[] } | null> => {
    try {
      const response = await fetch(`${API_URL}/users/featured`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update user status (active/inactive)
  updateUserStatus: async (id: string, isActive: boolean): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update user subscription
  updateUserSubscription: async (id: string, subscription: string, subExpiry: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${id}/subscription`, {
        method: "PUT",
        body: JSON.stringify({ subscription, subExpiry }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Delete all users (admin only)
  deleteAllUsers: async (): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/all`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Delete all data (users and listings)
  deleteAllData: async (): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/admin/delete-all-data`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

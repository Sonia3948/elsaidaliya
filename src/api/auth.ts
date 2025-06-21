
import { fetchWithAuth, handleResponse, handleFetchError } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  wilaya: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  token?: string;
  error?: string;
}

// API functions for authentication
export const authAPI = {
  // User login
  login: async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    try {
      console.log("Attempting login with credentials:", { identifier: credentials.identifier });
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });
      
      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, response data:", data);
        
        if (data.user && !data.user.token) {
          data.user.token = `session-token-${Date.now()}`;
        }
        
        return data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("Login failed with error:", errorData);
        return { error: errorData.error || "Erreur de connexion", user: null };
      }
    } catch (error) {
      console.error("Login error:", error);
      return handleFetchError(error);
    }
  },

  // User registration
  register: async (userData: RegisterData): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

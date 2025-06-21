
import { toast } from "sonner";
import { getAuthToken, handleResponse, handleFetchError } from "./common";

const API_URL = "http://localhost:8080/api";

// Services d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: any) => {
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
  
  // Connexion d'un utilisateur (including admin)
  login: async (credentials: { identifier: string; password: string }) => {
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
        
        // Ensure the user object has a token field
        if (data.user) {
          if (!data.user.token && !data.user.sessionToken) {
            // Generate a session token if none provided by backend
            data.user.token = `session-token-${Date.now()}`;
            console.log("Generated token for user:", data.user.token);
          }
        }
        
        return data;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("Login failed with error:", errorData);
        return { error: errorData.error || "Erreur de connexion" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return handleFetchError(error);
    }
  },
  
  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email: string) => {
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
  },
};

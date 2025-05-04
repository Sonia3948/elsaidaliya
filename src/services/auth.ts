
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });
      
      return await handleResponse(response);
    } catch (error) {
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

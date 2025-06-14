import { getAuthToken, handleResponse, handleFetchError, fetchWithAuth } from "./common";

const API_URL = "http://localhost:8080/api";

// Services pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs (admin)
  getAllUsers: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters as Record<string, string>).toString();
      const url = `${API_URL}/users${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer les utilisateurs en attente d'approbation
  getPendingUsers: async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/pending`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer un utilisateur par ID
  getUserById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Mise à jour d'un utilisateur
  updateUser: async (id: string, userData: any) => {
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
  
  // Mise à jour du statut d'un utilisateur (actif/inactif)
  updateUserStatus: async (id: string, isActive: boolean) => {
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
  
  // Mise à jour de l'abonnement d'un utilisateur
  updateUserSubscription: async (id: string, subscription: string, subExpiry: string) => {
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
  
  // Supprimer tous les utilisateurs (admin seulement)
  deleteAllUsers: async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/users/all`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

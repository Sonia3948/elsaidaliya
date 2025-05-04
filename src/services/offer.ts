
import { getAuthToken, handleResponse, handleFetchError, fetchWithAuth } from "./common";

const API_URL = "http://localhost:8080/api";

// Services pour les offres
export const offerService = {
  // Récupérer toutes les offres
  getAllOffers: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters as Record<string, string>).toString();
      const url = `${API_URL}/offers${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer une offre par ID
  getOfferById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/offers/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer une nouvelle offre
  createOffer: async (offerData: any) => {
    try {
      // Handle image upload if present
      if (offerData.image) {
        const formData = new FormData();
        formData.append("image", offerData.image);
        formData.append("data", JSON.stringify({
          title: offerData.title,
          description: offerData.description,
          price: offerData.price,
          expiresAt: offerData.expiresAt,
        }));
        
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/offers`, {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        });
        
        return await handleResponse(response);
      } else {
        // Regular JSON request if no image
        const response = await fetchWithAuth(`${API_URL}/offers`, {
          method: "POST",
          body: JSON.stringify(offerData),
        });
        
        return await handleResponse(response);
      }
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mettre à jour une offre
  updateOffer: async (id: string, offerData: any) => {
    try {
      // Handle image upload if present
      if (offerData.image) {
        const formData = new FormData();
        formData.append("image", offerData.image);
        formData.append("data", JSON.stringify({
          title: offerData.title,
          description: offerData.description,
          price: offerData.price,
          expiresAt: offerData.expiresAt,
        }));
        
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/offers/${id}`, {
          method: "PUT",
          headers,
          body: formData,
          credentials: "include",
        });
        
        return await handleResponse(response);
      } else {
        // Regular JSON request if no image
        const response = await fetchWithAuth(`${API_URL}/offers/${id}`, {
          method: "PUT",
          body: JSON.stringify(offerData),
        });
        
        return await handleResponse(response);
      }
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Supprimer une offre
  deleteOffer: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/offers/${id}`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
};


import { fetchWithAuth, handleResponse, handleFetchError, getAuthToken } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  expiresAt: string;
  createdAt: string;
  userId: string;
  image?: string;
}

export interface CreateOfferData {
  title: string;
  description: string;
  price: number;
  expiresAt: string;
  image?: File;
}

// API functions for offers
export const offersAPI = {
  // Get all offers
  getAllOffers: async (filters: Record<string, string> = {}): Promise<{ offers: Offer[] } | null> => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_URL}/offers${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get offer by ID
  getOfferById: async (id: string): Promise<Offer | null> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/offers/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Create new offer
  createOffer: async (offerData: CreateOfferData): Promise<any> => {
    try {
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

  // Update offer
  updateOffer: async (id: string, offerData: CreateOfferData): Promise<any> => {
    try {
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

  // Delete offer
  deleteOffer: async (id: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/offers/${id}`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

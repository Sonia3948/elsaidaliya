
import { fetchWithAuth, handleResponse, handleFetchError, getAuthToken } from "@/services/common";

const API_URL = "http://localhost:8080/api";

export interface Listing {
  id: string;
  title: string;
  description: string;
  medications: string[];
  createdAt: string;
  userId: string;
  file?: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  medications: string[];
  file?: File;
}

// API functions for listings
export const listingsAPI = {
  // Get all listings
  getAllListings: async (filters: Record<string, string> = {}): Promise<{ listings: Listing[] } | null> => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_URL}/listings${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get listing by ID
  getListingById: async (id: string): Promise<Listing | null> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Create new listing
  createListing: async (listingData: CreateListingData): Promise<any> => {
    try {
      if (listingData.file) {
        const formData = new FormData();
        formData.append("file", listingData.file);
        formData.append("data", JSON.stringify({
          title: listingData.title,
          description: listingData.description,
          medications: listingData.medications || [],
        }));
        
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/listings`, {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        });
        
        return await handleResponse(response);
      } else {
        const response = await fetchWithAuth(`${API_URL}/listings`, {
          method: "POST",
          body: JSON.stringify(listingData),
        });
        
        return await handleResponse(response);
      }
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update listing
  updateListing: async (id: string, listingData: CreateListingData): Promise<any> => {
    try {
      if (listingData.file) {
        const formData = new FormData();
        formData.append("file", listingData.file);
        formData.append("data", JSON.stringify({
          title: listingData.title,
          description: listingData.description,
          medications: listingData.medications || [],
        }));
        
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/listings/${id}`, {
          method: "PUT",
          headers,
          body: formData,
          credentials: "include",
        });
        
        return await handleResponse(response);
      } else {
        const response = await fetchWithAuth(`${API_URL}/listings/${id}`, {
          method: "PUT",
          body: JSON.stringify(listingData),
        });
        
        return await handleResponse(response);
      }
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Delete listing
  deleteListing: async (id: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/${id}`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Search medicines
  searchMedicines: async (query: string): Promise<any> => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/search?q=${encodeURIComponent(query)}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

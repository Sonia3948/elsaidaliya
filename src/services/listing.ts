
import { getAuthToken, handleResponse, handleFetchError, fetchWithAuth } from "./common";

const API_URL = "http://localhost:8080/api";

// Services pour les listings
export const listingService = {
  // Récupérer tous les listings
  getAllListings: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters as Record<string, string>).toString();
      const url = `${API_URL}/listings${queryString ? `?${queryString}` : ''}`;
      const response = await fetchWithAuth(url);
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer un listing par ID
  getListingById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer un nouveau listing
  createListing: async (listingData: any) => {
    try {
      // Handle file upload if present
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
        // Regular JSON request if no file
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
  
  // Mettre à jour un listing
  updateListing: async (id: string, listingData: any) => {
    try {
      // Handle file upload if present
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
        // Regular JSON request if no file
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
  
  // Supprimer un listing
  deleteListing: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/${id}`, {
        method: "DELETE",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Rechercher des médicaments
  searchMedicines: async (query: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/listings/search?q=${encodeURIComponent(query)}`);
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

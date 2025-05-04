
// API service pour communiquer avec le backend Go
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";

// Function to get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  return null;
};

// Standard fetch with authorization headers
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};

// Fonction générique pour gérer les erreurs des requêtes
const handleFetchError = (error: any) => {
  console.error("API Error:", error);
  toast.error("Une erreur est survenue lors de la communication avec le serveur");
  return null;
};

// Fonction pour gérer les réponses des requêtes
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Une erreur est survenue");
  }
  
  return response.json();
};

// Services d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: any) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/auth/register`, {
        method: "POST",
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
};

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

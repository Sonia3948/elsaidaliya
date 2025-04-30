
// API service pour communiquer avec le backend Go
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";

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
    throw new Error(errorData.message || "Une erreur est survenue");
  }
  
  return response.json();
};

// Services d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include"
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Connexion d'un utilisateur
  login: async (credentials: { email: string; password: string }) => {
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
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer un utilisateur par ID
  getUserById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        credentials: "include",
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
  getAllListings: async () => {
    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: "GET",
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer un nouveau listing
  createListing: async (listingData: any) => {
    try {
      const formData = new FormData();
      
      // Si le listing contient un fichier PDF
      if (listingData.file) {
        formData.append("file", listingData.file);
      }
      
      // Ajouter les autres données
      formData.append("data", JSON.stringify({
        title: listingData.title,
        description: listingData.description,
      }));
      
      const response = await fetch(`${API_URL}/listings`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Rechercher des médicaments
  searchMedicines: async (query: string) => {
    try {
      const response = await fetch(`${API_URL}/listings/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

// Services pour les offres
export const offerService = {
  // Récupérer toutes les offres
  getAllOffers: async () => {
    try {
      const response = await fetch(`${API_URL}/offers`, {
        method: "GET",
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer une nouvelle offre
  createOffer: async (offerData: any) => {
    try {
      const formData = new FormData();
      
      // Si l'offre contient une image
      if (offerData.image) {
        formData.append("image", offerData.image);
      }
      
      // Ajouter les autres données
      formData.append("data", JSON.stringify({
        title: offerData.title,
        description: offerData.description,
        price: offerData.price,
      }));
      
      const response = await fetch(`${API_URL}/offers`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      return await handleResponse(response);
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

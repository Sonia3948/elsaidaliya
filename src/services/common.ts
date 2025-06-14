
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";

// Function to get auth token from localStorage
export const getAuthToken = () => {
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
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("Making request to:", url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
    
    console.log("Response status:", response.status);
    return response;
  } catch (error) {
    console.error("Fetch error for URL:", url, error);
    throw error;
  }
};

// Fonction générique pour gérer les erreurs des requêtes
export const handleFetchError = (error: any) => {
  console.error("API Error details:", error);
  
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    toast.error("Impossible de se connecter au serveur. Vérifiez que le serveur backend est en cours d'exécution sur localhost:8080");
  } else {
    toast.error("Une erreur est survenue lors de la communication avec le serveur");
  }
  return null;
};

// Fonction pour gérer les réponses des requêtes
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Une erreur est survenue");
  }
  
  return response.json();
};

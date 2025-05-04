
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

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};

// Fonction générique pour gérer les erreurs des requêtes
export const handleFetchError = (error: any) => {
  console.error("API Error:", error);
  toast.error("Une erreur est survenue lors de la communication avec le serveur");
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

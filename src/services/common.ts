
import { toast } from "sonner";

const API_URL = "http://localhost:8080/api";

// Function to get auth token from localStorage
export const getAuthToken = () => {
  const user = localStorage.getItem("user");
  console.log("Raw user data from localStorage:", user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("Parsed user data:", userData);
      
      // Check for token in different possible locations
      const token = userData.token || userData.sessionToken || userData.accessToken;
      console.log("Extracted token:", token);
      
      return token;
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  
  console.log("No user data found in localStorage");
  return null;
};

// Standard fetch with authorization headers
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  console.log("Token for request:", token);
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("Adding auth header with token:", token);
  } else {
    console.log("No auth token found - request will be unauthenticated");
  }

  console.log("Making authenticated request to:", url);
  console.log("Request headers:", headers);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    // Handle 401 responses by redirecting to login
    if (response.status === 401) {
      console.log("Unauthorized - clearing localStorage and redirecting to login");
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
      return response;
    }
    
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
  console.log("Handling response with status:", response.status);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    console.log("Error response data:", errorData);
    throw new Error(errorData.error || "Une erreur est survenue");
  }
  
  try {
    const data = await response.json();
    console.log("Success response data:", data);
    return data;
  } catch (e) {
    console.error("Error parsing response JSON:", e);
    return {};
  }
};


import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to get current user session
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting current user:", error);
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Function to get auth session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Standard fetch with authorization headers (now using Supabase session)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const session = await getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 responses by redirecting to login
    if (response.status === 401) {
      console.log("Unauthorized - redirecting to login");
      window.location.href = "/login";
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
    toast.error("Impossible de se connecter au serveur.");
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

// Legacy function for backward compatibility
export const getAuthToken = () => {
  console.warn("getAuthToken is deprecated, use getSession instead");
  return null;
};

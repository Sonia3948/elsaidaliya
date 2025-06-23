
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: {
    businessName: string;
    role: string;
    phone: string;
    email: string;
    password: string;
    wilaya: string;
    registerImageUrl?: string;
    registerNumber?: string;
  }) => {
    try {
      console.log("Attempting registration with Supabase:", { email: userData.email, role: userData.role });
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            business_name: userData.businessName,
            role: userData.role,
            phone: userData.phone,
            wilaya: userData.wilaya,
            register_image_url: userData.registerImageUrl,
            register_number: userData.registerNumber,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error("Registration error:", error);
        return { error: error.message };
      }

      console.log("Registration successful:", data);
      return { 
        message: "Utilisateur enregistré avec succès. Vérifiez votre email pour confirmer votre compte.",
        user: data.user 
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return { error: "Une erreur est survenue lors de l'inscription" };
    }
  },
  
  // Connexion d'un utilisateur
  login: async (credentials: { identifier: string; password: string }) => {
    try {
      console.log("Attempting login with Supabase:", { identifier: credentials.identifier });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.identifier,
        password: credentials.password,
      });
      
      if (error) {
        console.error("Login error:", error);
        return { error: error.message };
      }

      console.log("Login successful:", data);
      
      return {
        message: "Connexion réussie",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          ...data.user?.user_metadata,
          token: data.session?.access_token,
        }
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return { error: "Une erreur est survenue lors de la connexion" };
    }
  },
  
  // Déconnexion
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        return { error: error.message };
      }
      return { message: "Déconnexion réussie" };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { error: "Une erreur est survenue lors de la déconnexion" };
    }
  },
  
  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error);
        return { error: error.message };
      }
      
      return { message: "Un email de réinitialisation a été envoyé à votre adresse" };
    } catch (error: any) {
      console.error("Password reset error:", error);
      return { error: "Une erreur est survenue lors de la demande de réinitialisation" };
    }
  },
};

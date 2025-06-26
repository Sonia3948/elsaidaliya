
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

export const userService = {
  // Récupérer tous les utilisateurs (admin)
  getAllUsers: async (filters: Record<string, any> = {}) => {
    try {
      let query = supabase.from('profiles').select('*');
      
      // Apply filters if provided
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching users:", error);
        return null;
      }
      
      return { users: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer les fournisseurs vedettes (public endpoint)
  getFeaturedSuppliers: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'fournisseur')
        .eq('is_active', true)
        .eq('subscription', 'or')
        .limit(6);
      
      if (error) {
        console.error("Error fetching featured suppliers:", error);
        return null;
      }
      
      return { suppliers: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer les utilisateurs en attente d'approbation
  getPendingUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', false);
      
      if (error) {
        console.error("Error fetching pending users:", error);
        return null;
      }
      
      return { users: data || [], total: data?.length || 0 };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer un utilisateur par ID
  getUserById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }
      
      return { user: data };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mise à jour d'un utilisateur
  updateUser: async (id: string, userData: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user:", error);
        return null;
      }
      
      return { user: data, message: "Utilisateur mis à jour avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mise à jour du statut d'un utilisateur (actif/inactif)
  updateUserStatus: async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user status:", error);
        return null;
      }
      
      return { user: data, message: `Statut utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès` };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mise à jour de l'abonnement d'un utilisateur
  updateUserSubscription: async (id: string, subscription: string, subExpiry: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          subscription, 
          sub_expiry: subExpiry 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating user subscription:", error);
        return null;
      }
      
      return { user: data, message: "Abonnement mis à jour avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Supprimer tous les utilisateurs (admin seulement)
  deleteAllUsers: async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep system admin
      
      if (error) {
        console.error("Error deleting users:", error);
        return null;
      }
      
      return { message: "Tous les utilisateurs ont été supprimés" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Supprimer toutes les données (utilisateurs et listings)
  deleteAllData: async () => {
    try {
      // Delete in correct order to respect foreign key constraints
      await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('offers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      return { message: "Toutes les données ont été supprimées" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

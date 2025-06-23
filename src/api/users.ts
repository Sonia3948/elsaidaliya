
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "@/services/common";

export interface PendingUser {
  id: string;
  business_name: string;
  role: string;
  email?: string;
  created_at: string;
}

export interface PendingUsersResponse {
  users: PendingUser[];
  total: number;
}

export const pendingUsersAPI = {
  // Get all pending users
  getPendingUsers: async (): Promise<PendingUsersResponse | null> => {
    try {
      console.log("Fetching pending users...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', false);
      
      if (error) {
        console.error("Error fetching pending users:", error);
        return null;
      }
      
      console.log("Pending users response:", data);
      return { users: data || [], total: data?.length || 0 };
    } catch (error) {
      console.error("Error in getPendingUsers:", error);
      return handleFetchError(error);
    }
  },

  // Approve a pending user
  approveUser: async (userId: string): Promise<any> => {
    try {
      console.log("Approving user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error("Error approving user:", error);
        return null;
      }
      
      return { user: data, message: "Utilisateur approuvé avec succès" };
    } catch (error) {
      console.error("Error approving user:", error);
      return handleFetchError(error);
    }
  },

  // Reject a pending user
  rejectUser: async (userId: string): Promise<any> => {
    try {
      console.log("Rejecting user:", userId);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("Error rejecting user:", error);
        return null;
      }
      
      return { message: "Utilisateur rejeté avec succès" };
    } catch (error) {
      console.error("Error rejecting user:", error);
      return handleFetchError(error);
    }
  }
};

// General users API
export const usersAPI = {
  // Get all users
  getUsers: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error("Error fetching users:", error);
        return null;
      }
      
      return { users: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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

  // Update user
  updateUser: async (userId: string, userData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)
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

  // Delete user
  deleteUser: async (userId: string): Promise<any> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        return null;
      }
      
      return { message: "Utilisateur supprimé avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  }
};

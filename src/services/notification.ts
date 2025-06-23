
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

export const notificationService = {
  // Get all notifications for the current user
  getUserNotifications: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        return null;
      }
      
      return { notifications: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Mark a notification as read
  markAsRead: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error marking notification as read:", error);
        return null;
      }
      
      return { notification: data, message: "Notification marquée comme lue" };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Update notification status
  updateStatus: async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating notification status:", error);
        return null;
      }
      
      return { notification: data, message: "Statut de la notification mis à jour" };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Create a new notification
  createNotification: async (notificationData: any) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating notification:", error);
        return null;
      }
      
      return { notification: data, message: "Notification créée avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

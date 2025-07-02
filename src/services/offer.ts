
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

interface OfferFilters {
  status?: string;
  supplier_id?: string;
  [key: string]: any;
}

export const offerService = {
  // Récupérer toutes les offres
  getAllOffers: async (filters: OfferFilters = {}) => {
    try {
      let query = supabase
        .from('offers')
        .select(`
          *,
          profiles:supplier_id (
            business_name,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters if provided
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching offers:", error);
        return null;
      }
      
      return { offers: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer une offre par ID
  getOfferById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          profiles:supplier_id (
            business_name,
            phone,
            email
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching offer:", error);
        return null;
      }
      
      return { offer: data };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer une nouvelle offre
  createOffer: async (offerData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      const { data, error } = await supabase
        .from('offers')
        .insert({
          ...offerData,
          supplier_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating offer:", error);
        return { error: error.message };
      }
      
      return { 
        offer: data, 
        message: "Offre créée avec succès" 
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mettre à jour une offre
  updateOffer: async (id: string, offerData: any) => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .update(offerData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating offer:", error);
        return { error: error.message };
      }
      
      return { 
        offer: data, 
        message: "Offre mise à jour avec succès" 
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Supprimer une offre
  deleteOffer: async (id: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting offer:", error);
        return { error: error.message };
      }
      
      return { message: "Offre supprimée avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

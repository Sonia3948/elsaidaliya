import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

interface ListingFilters {
  [key: string]: any;
}

export const listingService = {
  // Récupérer tous les listings
  getAllListings: async (filters: ListingFilters = {}) => {
    try {
      let query = supabase
        .from('listings')
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
      if (filters) {
        const filterKeys = Object.keys(filters);
        for (let i = 0; i < filterKeys.length; i++) {
          const key = filterKeys[i];
          const value = filters[key];
          if (value) {
            query = query.eq(key, value);
          }
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching listings:", error);
        return null;
      }
      
      return { listings: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Récupérer un listing par ID
  getListingById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
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
        console.error("Error fetching listing:", error);
        return null;
      }
      
      return { listing: data };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Créer un nouveau listing
  createListing: async (listingData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          supplier_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating listing:", error);
        return { error: error.message };
      }
      
      return { 
        listing: data, 
        message: "Listing créé avec succès" 
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Mettre à jour un listing
  updateListing: async (id: string, listingData: any) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating listing:", error);
        return { error: error.message };
      }
      
      return { 
        listing: data, 
        message: "Listing mis à jour avec succès" 
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Supprimer un listing
  deleteListing: async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting listing:", error);
        return { error: error.message };
      }
      
      return { message: "Listing supprimé avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },
  
  // Rechercher des listings
  searchListings: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:supplier_id (
            business_name,
            phone,
            email
          )
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,medications.cs.{name:"${query}"}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error searching listings:", error);
        return null;
      }
      
      return { listings: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Search medicines - added to fix the missing method error
  searchMedicines: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:supplier_id (
            business_name,
            phone,
            email
          )
        `)
        .or(`medications.cs.{name:"${query}"}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error searching medicines:", error);
        return null;
      }
      
      return { listings: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

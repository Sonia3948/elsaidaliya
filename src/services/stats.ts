
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

export const statsService = {
  // Enregistrer une statistique
  recordStat: async (type: string, targetId?: string, visitorWilaya?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const statData: any = {
        type,
        visitor_wilaya: visitorWilaya,
      };

      if (user) {
        statData.user_id = user.id;
      }

      if (targetId) {
        statData.target_id = targetId;
      }

      const { error } = await supabase
        .from('stats')
        .insert(statData);
      
      if (error) {
        console.error("Error recording stat:", error);
      }
    } catch (error) {
      console.error("Error recording stat:", error);
    }
  },

  // Récupérer les statistiques générales (admin)
  getGeneralStats: async () => {
    try {
      // Compter les utilisateurs par rôle
      const { data: userStats, error: userError } = await supabase
        .from('profiles')
        .select('role, is_active')
        .neq('role', 'admin'); // Exclure les administrateurs

      if (userError) {
        console.error("Error fetching user stats:", userError);
        return null;
      }

      // Compter les listings actifs
      const { count: listingsCount, error: listingsError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (listingsError) {
        console.error("Error fetching listings count:", listingsError);
      }

      // Compter les offres actives
      const { count: offersCount, error: offersError } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (offersError) {
        console.error("Error fetching offers count:", offersError);
      }

      // Compter les paiements en attente
      const { count: pendingPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (paymentsError) {
        console.error("Error fetching pending payments:", paymentsError);
      }

      // Analyser les données utilisateurs
      const totalUsers = userStats?.length || 0;
      const activeUsers = userStats?.filter(u => u.is_active).length || 0;
      const pendingUsers = userStats?.filter(u => !u.is_active).length || 0;
      const pharmacists = userStats?.filter(u => u.role === 'pharmacien').length || 0;
      const suppliers = userStats?.filter(u => u.role === 'fournisseur').length || 0;

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          pharmacists,
          suppliers
        },
        content: {
          listings: listingsCount || 0,
          offers: offersCount || 0
        },
        payments: {
          pending: pendingPayments || 0
        }
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Récupérer les statistiques d'un fournisseur
  getSupplierStats: async (supplierId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetId = supplierId || user?.id;
      
      if (!targetId) {
        return { error: "Utilisateur non authentifié" };
      }

      // Statistiques des listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('view_count, download_count')
        .eq('supplier_id', targetId);

      if (listingsError) {
        console.error("Error fetching supplier listings stats:", listingsError);
      }

      // Statistiques des offres
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('view_count')
        .eq('supplier_id', targetId);

      if (offersError) {
        console.error("Error fetching supplier offers stats:", offersError);
      }

      const totalListingViews = listings?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0;
      const totalDownloads = listings?.reduce((sum, l) => sum + (l.download_count || 0), 0) || 0;
      const totalOfferViews = offers?.reduce((sum, o) => sum + (o.view_count || 0), 0) || 0;

      return {
        listings: {
          count: listings?.length || 0,
          totalViews: totalListingViews,
          totalDownloads: totalDownloads
        },
        offers: {
          count: offers?.length || 0,
          totalViews: totalOfferViews
        }
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};

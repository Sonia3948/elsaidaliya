
import { supabase } from "@/integrations/supabase/client";
import { handleFetchError } from "./common";

export interface PaymentData {
  amount: number;
  plan_type: 'bronze' | 'argent' | 'or';
  payment_method: 'virement' | 'carte';
  bank_name?: string;
  receipt_url?: string;
  receipt_number?: string;
}

export const paymentService = {
  // Créer un nouveau paiement
  createPayment: async (paymentData: PaymentData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      // Calculer la date d'expiration (1 an pour tous les plans)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { data, error } = await supabase
        .from('payments')
        .insert({
          ...paymentData,
          user_id: user.id,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating payment:", error);
        return { error: error.message };
      }
      
      return { 
        payment: data, 
        message: "Paiement enregistré avec succès. En attente de validation." 
      };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Récupérer tous les paiements (admin)
  getAllPayments: async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles:user_id (
            business_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching payments:", error);
        return null;
      }
      
      return { payments: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Récupérer les paiements en attente
  getPendingPayments: async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles:user_id (
            business_name,
            email,
            role
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching pending payments:", error);
        return null;
      }
      
      return { payments: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Approuver un paiement (admin)
  approvePayment: async (paymentId: string, adminNotes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      // Récupérer le paiement pour obtenir l'utilisateur et le plan
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('user_id, plan_type, expires_at')
        .eq('id', paymentId)
        .single();

      if (fetchError) {
        return { error: "Paiement non trouvé" };
      }

      // Mettre à jour le statut du paiement
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'approved',
          processed_by: user.id,
          processed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', paymentId);

      if (updateError) {
        return { error: updateError.message };
      }

      // Mettre à jour l'abonnement de l'utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription: payment.plan_type,
          sub_expiry: payment.expires_at
        })
        .eq('id', payment.user_id);

      if (profileError) {
        console.error("Error updating user subscription:", profileError);
      }

      return { message: "Paiement approuvé avec succès" };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Rejeter un paiement (admin)
  rejectPayment: async (paymentId: string, adminNotes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          processed_by: user.id,
          processed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', paymentId);

      if (error) {
        return { error: error.message };
      }

      return { message: "Paiement rejeté" };
    } catch (error) {
      return handleFetchError(error);
    }
  },

  // Récupérer l'historique des paiements d'un utilisateur
  getUserPayments: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Utilisateur non authentifié" };
      }

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching user payments:", error);
        return null;
      }
      
      return { payments: data || [] };
    } catch (error) {
      return handleFetchError(error);
    }
  },
};


-- Supprimer les anciennes données pour une base propre
DELETE FROM public.notifications;
DELETE FROM public.offers;
DELETE FROM public.listings;
DELETE FROM public.profiles;

-- Améliorer la table profiles avec tous les champs nécessaires
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'pharmacien', 'fournisseur'));

-- Ajouter les colonnes manquantes à la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_info JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Créer la table des paiements
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  plan_type TEXT NOT NULL CHECK (plan_type IN ('bronze', 'argent', 'or')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('virement', 'carte')),
  bank_name TEXT,
  receipt_url TEXT,
  receipt_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_by UUID REFERENCES public.profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer la table des évaluations/notes
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pharmacist_id, supplier_id)
);

-- Créer la table des statistiques
CREATE TABLE IF NOT EXISTS public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('listing_view', 'listing_download', 'offer_view', 'profile_view')),
  target_id UUID,
  visitor_id UUID REFERENCES public.profiles(id),
  visitor_wilaya TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Améliorer la table listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Améliorer la table offers
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS target_wilayas TEXT[];

-- Améliorer la table notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS notification_type TEXT DEFAULT 'general' 
CHECK (notification_type IN ('general', 'new_listing', 'new_offer', 'payment', 'rating', 'system'));
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_role TEXT 
CHECK (target_role IN ('admin', 'pharmacien', 'fournisseur', 'all'));
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS related_id UUID;

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politiques RLS pour ratings
CREATE POLICY "Users can view ratings for suppliers" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Pharmacists can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (
    auth.uid() = pharmacist_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'pharmacien'
    )
  );

CREATE POLICY "Pharmacists can update their own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = pharmacist_id);

-- Politiques RLS pour stats
CREATE POLICY "Users can view their own stats" ON public.stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create stats" ON public.stats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all stats" ON public.stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fonction pour mettre à jour la moyenne des évaluations
CREATE OR REPLACE FUNCTION update_supplier_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    rating_average = (
      SELECT AVG(rating) FROM public.ratings 
      WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id)
    ),
    total_ratings = (
      SELECT COUNT(*) FROM public.ratings 
      WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id)
    )
  WHERE id = COALESCE(NEW.supplier_id, OLD.supplier_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement les ratings
DROP TRIGGER IF EXISTS trigger_update_supplier_rating_insert ON public.ratings;
CREATE TRIGGER trigger_update_supplier_rating_insert
  AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_supplier_rating();

DROP TRIGGER IF EXISTS trigger_update_supplier_rating_update ON public.ratings;
CREATE TRIGGER trigger_update_supplier_rating_update
  AFTER UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_supplier_rating();

DROP TRIGGER IF EXISTS trigger_update_supplier_rating_delete ON public.ratings;
CREATE TRIGGER trigger_update_supplier_rating_delete
  AFTER DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_supplier_rating();

-- Créer l'utilisateur admin par défaut
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@elsaidaliya.dz',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "admin", "business_name": "El Saidaliya Admin"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Créer le profil admin
INSERT INTO public.profiles (
  id,
  business_name,
  role,
  email,
  phone,
  wilaya,
  is_active,
  subscription,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'El Saidaliya Administration',
  'admin',
  'admin@elsaidaliya.dz',
  '+213 555 000 000',
  'Alger',
  true,
  'unlimited',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  wilaya = EXCLUDED.wilaya,
  is_active = EXCLUDED.is_active,
  subscription = EXCLUDED.subscription,
  updated_at = now();

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_wilaya ON public.profiles(wilaya);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_supplier_id ON public.listings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_offers_supplier_id ON public.offers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_supplier_id ON public.ratings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_stats_user_id ON public.stats(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

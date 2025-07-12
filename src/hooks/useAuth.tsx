
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (userData: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profileData) => {
          setProfile(profileData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message === 'Invalid login credentials' 
            ? "Email ou mot de passe incorrect" 
            : error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        // Show role-specific welcome message
        const welcomeMessage = profileData?.role === 'admin' 
          ? "Bienvenue au tableau de bord administrateur"
          : profileData?.role === 'pharmacien'
          ? "Bienvenue dans votre espace pharmacien"
          : profileData?.role === 'fournisseur'
          ? "Bienvenue dans votre espace fournisseur"
          : "Bienvenue sur El Saidaliya";
        
        toast({
          title: "Connexion réussie",
          description: welcomeMessage,
        });
      }

      return {};
    } catch (error: any) {
      const errorMessage = "Une erreur s'est produite lors de la connexion";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            business_name: userData.business_name,
            role: userData.role,
            phone: userData.phone,
            wilaya: userData.wilaya,
            register_number: userData.register_number,
            register_image_url: userData.register_image_url,
          }
        }
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('already registered')) {
          errorMessage = "Cet email est déjà utilisé";
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: errorMessage };
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Veuillez vérifier votre email pour confirmer votre inscription.",
      });

      return {};
    } catch (error: any) {
      const errorMessage = "Une erreur s'est produite lors de l'inscription";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur El Saidaliya",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

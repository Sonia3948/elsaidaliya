
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'pharmacien' | 'fournisseur';
  requireActive?: boolean;
}

const AuthGuard = ({ children, requiredRole, requireActive = true }: AuthGuardProps) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      if (!profile) {
        // Profile not loaded yet or doesn't exist
        console.log('Profile not found for user:', user.id);
        return;
      }

      if (requiredRole && profile.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        const redirectPath = profile.role === 'admin' 
          ? '/admin/dashboard'
          : profile.role === 'pharmacien' 
          ? '/pharmacist/dashboard'
          : '/supplier/dashboard';
        
        navigate(redirectPath, { replace: true });
        return;
      }

      if (requireActive && !profile.is_active && profile.role !== 'admin') {
        // Account not activated (except for admin)
        console.log('Account not active for user:', user.id);
        // Allow access but show notice in dashboard
      }
    }
  }, [user, profile, loading, navigate, location, requiredRole, requireActive]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pharmacy-dark" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Redirect is handled in useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;

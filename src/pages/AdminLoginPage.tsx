
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";
import { useAuth } from "@/hooks/useAuth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && profile && profile.role === 'admin') {
      console.log('Admin already logged in, redirecting to dashboard');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, profile, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Check for the hardcoded admin account
      if (formData.identifier === "khemissisonia08@gmail.com" && formData.password === "Ned@08") {
        // Simulate successful login with admin account including session token
        const adminUser = {
          id: "admin-id",
          email: "khemissisonia08@gmail.com",
          role: "admin",
          business_name: "El Saidaliya Administration",
          token: "dev-admin-session-token-12345"
        };
        
        console.log("Storing admin user data:", adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        
        // Verify storage
        const storedUser = localStorage.getItem("user");
        console.log("Verified stored user data:", storedUser);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord administrateur!"
        });
        
        // Redirect to admin dashboard
        console.log("Redirecting to admin dashboard");
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Try to login with real API
        const response = await authService.login({
          identifier: formData.identifier,
          password: formData.password
        });
        
        if (response && response.user && response.user.role === "admin") {
          console.log("Storing API user data:", response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
          
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur le tableau de bord administrateur!"
          });
          navigate("/admin/dashboard", { replace: true });
        } else {
          setError("Identifiants administrateur invalides");
        }
      }
    } catch (error) {
      setError("Erreur de connexion");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px-200px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-medical-dark flex items-center justify-center">
              <span className="text-white font-bold text-lg">ES</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Accès Administrateur
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Veuillez vous connecter avec vos identifiants administrateur
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Email administrateur
                </label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="email"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="admin@elsaidaliya.dz"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.identifier || !formData.password}
                  className="w-full bg-pharmacy hover:bg-pharmacy-dark bg-pharmacy-accent"
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-gray-600 hover:text-pharmacy-accent">
                  Retour à la page de connexion standard
                </Link>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-center text-gray-500">
                Compte administrateur de test :<br />
                <strong>khemissisonia08@gmail.com</strong> / <strong>Ned@08</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLoginPage;

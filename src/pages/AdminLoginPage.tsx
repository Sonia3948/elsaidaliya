
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (formData.identifier === "0549050018" && formData.password === "Ned@0820") {
        // Simulate successful login with admin account including session token
        const adminUser = {
          id: "admin-id",
          role: "admin",
          token: "dev-admin-session-token-12345" // Ensure token is properly set
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
        navigate("/admin/dashboard");
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
          navigate("/admin/dashboard");
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

  return <Layout>
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
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Identifiant
                </label>
                <Input 
                  id="identifier" 
                  name="identifier" 
                  type="text" 
                  required 
                  value={formData.identifier} 
                  onChange={handleChange} 
                  className="mt-1" 
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
                />
              </div>

              <div>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
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
          </div>
        </div>
      </div>
    </Layout>;
};

export default AdminLoginPage;

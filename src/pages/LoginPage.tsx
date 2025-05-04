import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
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
      // In development mode, check for the hardcoded admin account
      if (import.meta.env.DEV && formData.identifier === "0549050018" && formData.password === "Ned@0820") {
        // Simulate successful login with admin account
        const adminUser = {
          id: "admin-id",
          role: "admin"
        };
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord administrateur!"
        });
        navigate("/admin/dashboard");
        setIsLoading(false);
        return;
      }

      // Call the API for real login - Fixed: use identifier instead of email
      const response = await authService.login({
        identifier: formData.identifier, // Using identifier property instead of email
        password: formData.password
      });
      if (response && !response.error) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.user));
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Med-Supply-Link!"
        });

        // Redirect based on role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.user.role === "fournisseur") {
          navigate("/supplier/dashboard");
        } else {
          navigate("/pharmacist/dashboard");
        }
      } else {
        setError(response?.error || "Une erreur est survenue lors de la connexion");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
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
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{" "}
              <Link to="/register" className="font-medium text-medical hover:text-medical-dark">
                créez un nouveau compte
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Email ou téléphone
                </label>
                <Input id="identifier" name="identifier" type="text" autoComplete="email" required value={formData.identifier} onChange={handleChange} className="mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className="mt-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-medical focus:ring-medical-dark border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-medical hover:text-medical-dark">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" disabled={isLoading} className="w-full bg-pharmacy hover:bg-pharmacy-dark bg-pharmacy-accent">
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
              
              <div className="text-center mt-4">
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>;
};
export default LoginPage;

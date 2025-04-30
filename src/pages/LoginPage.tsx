
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock authentication - in a real app, this would call an API
      const mockUser = {
        id: "123",
        name: "Utilisateur Test",
        email: formData.identifier,
        role: "pharmacien", // or "fournisseur" or "admin"
      };
      
      // Store user in localStorage for demo purposes
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Med-Supply-Link!",
      });
      
      // Redirect based on role
      if (mockUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (mockUser.role === "fournisseur") {
        navigate("/supplier/dashboard");
      } else {
        navigate("/pharmacist/dashboard");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-64px-200px)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-medical-dark flex items-center justify-center">
              <span className="text-white font-bold text-lg">MS</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{" "}
              <Link
                to="/register"
                className="font-medium text-medical hover:text-medical-dark"
              >
                créez un nouveau compte
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email ou téléphone
                </label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="email"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-medical focus:ring-medical-dark border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="#"
                    className="font-medium text-medical hover:text-medical-dark"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-medical hover:bg-medical-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the API to request password reset
      const response = await authService.forgotPassword(email);
      
      if (response) {
        setIsSubmitted(true);
        toast({
          title: "Email envoyé",
          description: "Si un compte est associé à cet email, vous recevrez un lien de réinitialisation."
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
              Réinitialisation du mot de passe
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1" 
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-pharmacy hover:bg-pharmacy-dark bg-pharmacy-accent"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-gray-600 hover:text-pharmacy-accent">
                    Retour à la page de connexion
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                  <p>Un email de réinitialisation a été envoyé à <strong>{email}</strong>.</p>
                  <p className="mt-2">Veuillez vérifier votre boîte de réception et suivre les instructions.</p>
                </div>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline" 
                  className="mt-4"
                >
                  Essayer avec une autre adresse email
                </Button>
                <div className="mt-4">
                  <Link to="/login" className="text-sm text-gray-600 hover:text-pharmacy-accent">
                    Retour à la page de connexion
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;

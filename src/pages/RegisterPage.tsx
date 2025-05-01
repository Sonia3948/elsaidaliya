import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

// Wilaya options
const wilayaOptions = ["Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla"
// Add the rest of the wilayas as needed
];
const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    role: "pharmacien",
    // Default role
    registerImage: null,
    wilaya: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        registerImage: e.target.files[0]
      });
    }
  };
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };
  const handleWilayaChange = (value: string) => {
    setFormData({
      ...formData,
      wilaya: value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would call an API to register the user
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter."
      });
      navigate("/login");
      setIsLoading(false);
    }, 1500);
  };
  return <Layout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-gray-600">
              Déjà inscrit ?{" "}
              <Link to="/login" className="text-medical hover:text-medical-dark font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Raison sociale
                </label>
                <Input id="businessName" name="businessName" type="text" required value={formData.businessName} onChange={handleChange} className="mt-1" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pharmacien" id="pharmacien" />
                    <Label htmlFor="pharmacien">Pharmacien</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fournisseur" id="fournisseur" />
                    <Label htmlFor="fournisseur">Fournisseur</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <label htmlFor="registerImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Image du registre de commerce
                </label>
                <Input id="registerImage" name="registerImage" type="file" accept="image/*" required onChange={handleFileChange} className="mt-1" />
                <p className="text-xs text-gray-500 mt-1">
                  Format recommandé: JPG ou PNG, moins de 2MB
                </p>
              </div>
              
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
                  Wilaya
                </label>
                <Select value={formData.wilaya} onValueChange={handleWilayaChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayaOptions.map(wilaya => <SelectItem key={wilaya} value={wilaya}>
                        {wilaya}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="mt-1" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Au moins 8 caractères, avec des lettres et des chiffres
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe
                  </label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-medical focus:ring-medical-dark border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  J'accepte les{" "}
                  <Link to="#" className="text-medical hover:text-medical-dark">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="#" className="text-medical hover:text-medical-dark">
                    politique de confidentialité
                  </Link>
                </label>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full bg-medical hover:bg-medical-dark text-white font-normal bg-pharmacy-accent rounded-xl">
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>;
};
export default RegisterPage;
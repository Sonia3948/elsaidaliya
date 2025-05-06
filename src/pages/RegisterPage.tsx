import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

// Complete list of 58 Algerian wilayas
const wilayaOptions = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès", 
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaa", 
  "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", 
  "55 - Touggourt", "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    businessName: "",
    role: "pharmacien", // Default role
    registerImage: null,
    wilaya: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        registerImage: e.target.files[0]
      });
      
      // Clear error for this field
      if (errors.registerImage) {
        setErrors({
          ...errors,
          registerImage: ''
        });
      }
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
    
    // Clear error for this field
    if (errors.wilaya) {
      setErrors({
        ...errors,
        wilaya: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate all required fields
    if (!formData.businessName.trim()) newErrors.businessName = "La raison sociale est requise";
    if (!formData.registerImage) newErrors.registerImage = "L'image du registre est requise";
    if (!formData.wilaya) newErrors.wilaya = "La wilaya est requise";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    if (!formData.confirmPassword) newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    // Phone validation (simple Algerian format)
    if (formData.phone && !/^0[567][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide (doit commencer par 05, 06 ou 07 et avoir 10 chiffres)";
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    // Password confirmation validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Here we would normally make an API call to check if the email and phone are unique
    // For now we'll simulate it with a timeout
    
    setTimeout(() => {
      // In a real app, this would call an API to register the user
      toast({
        title: "Inscription réussie",
        description: `Votre compte a été créé. ${formData.role === "pharmacien" ? 
          "Veuillez patienter pendant la vérification de votre compte par un administrateur." : 
          "Veuillez effectuer le paiement de votre abonnement pour compléter votre inscription."}`
      });
      
      // Store information about the registration in localStorage for later use
      localStorage.setItem("pendingRegistration", JSON.stringify({
        role: formData.role,
        email: formData.email,
        timestamp: new Date().toISOString()
      }));
      
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
              <Link to="/login" className="text-pharmacy-dark hover:text-pharmacy font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Raison sociale <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="businessName" 
                  name="businessName" 
                  type="text" 
                  required 
                  value={formData.businessName} 
                  onChange={handleChange} 
                  className={`mt-1 ${errors.businessName ? 'border-red-500' : ''}`} 
                />
                {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle <span className="text-red-500">*</span>
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
                  Image du registre de commerce <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="registerImage" 
                  name="registerImage" 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={handleFileChange} 
                  className={`mt-1 ${errors.registerImage ? 'border-red-500' : ''}`} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format recommandé: JPG ou PNG, moins de 2MB
                </p>
                {errors.registerImage && <p className="text-sm text-red-500">{errors.registerImage}</p>}
              </div>
              
              <div>
                <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <Select value={formData.wilaya} onValueChange={handleWilayaChange}>
                  <SelectTrigger className={`w-full ${errors.wilaya ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionnez votre wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayaOptions.map(wilaya => (
                      <SelectItem key={wilaya} value={wilaya}>
                        {wilaya}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wilaya && <p className="mt-1 text-sm text-red-500">{errors.wilaya}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`} 
                    placeholder="0512345678"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`} 
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange} 
                    className={`mt-1 ${errors.password ? 'border-red-500' : ''}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Au moins 8 caractères, avec des lettres et des chiffres
                  </p>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`} 
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="acceptTerms" 
                  name="acceptTerms" 
                  type="checkbox" 
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required 
                  className={`h-4 w-4 text-pharmacy-dark focus:ring-pharmacy-dark border-gray-300 rounded ${errors.acceptTerms ? 'border-red-500' : ''}`} 
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  J'accepte les{" "}
                  <Link to="/terms" className="text-pharmacy-dark hover:text-pharmacy">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="/privacy-policy" className="text-pharmacy-dark hover:text-pharmacy">
                    politique de confidentialité
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
              
              <div className="bg-pharmacy-light p-4 rounded-md text-sm text-pharmacy-dark mb-4">
                <p className="font-medium mb-2">Information importante:</p>
                {formData.role === "pharmacien" ? (
                  <p>Après inscription, votre compte sera examiné par un administrateur avant d'être activé. Vous recevrez une notification dès que votre compte sera validé.</p>
                ) : (
                  <p>Après inscription, vous devrez sélectionner un abonnement et effectuer un paiement pour activer votre compte. Un administrateur validera votre compte sous 24h à 48h après réception du paiement.</p>
                )}
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full bg-pharmacy-dark hover:bg-pharmacy text-white font-normal rounded-xl">
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>;
};
export default RegisterPage;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
const ContactPage = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais."
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  return <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Des questions ou des suggestions ? N'hésitez pas à nous contacter.
              Notre équipe est à votre disposition pour vous aider.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Votre nom" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="votre@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Sujet</label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Le sujet de votre message" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Votre message..." rows={5} />
                  </div>
                  
                  <Button type="submit" className="w-full bg-medical hover:bg-medical-dark">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-medical-dark" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">contact@elsaidaliya.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-medical-dark" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Téléphone</p>
                      <p className="text-sm text-gray-600">+213 553 720 952</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      
                    </div>
                    <div className="ml-3">
                      
                      
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    
                    
                    
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default ContactPage;
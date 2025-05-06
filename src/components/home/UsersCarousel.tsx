
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Store, MapPin } from "lucide-react";

type User = {
  id: string;
  name: string;
  role: string;
  image: string;
  wilaya: string;
};

const dummyUsers = [
  {
    id: "1",
    name: "Pharmacie Centrale",
    role: "pharmacien",
    image: "/placeholder.svg",
    wilaya: "Alger"
  },
  {
    id: "2",
    name: "Med Supply",
    role: "fournisseur",
    image: "/placeholder.svg",
    wilaya: "Oran"
  },
  {
    id: "3",
    name: "Santé Plus",
    role: "pharmacien",
    image: "/placeholder.svg",
    wilaya: "Constantine"
  },
  {
    id: "4",
    name: "Pharma Solutions",
    role: "fournisseur",
    image: "/placeholder.svg",
    wilaya: "Annaba"
  },
  {
    id: "5",
    name: "Laboratoire El Kendi",
    role: "fournisseur",
    image: "/placeholder.svg",
    wilaya: "Blida"
  }
];

const UsersCarousel = () => {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % users.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [users]);

  // This would normally fetch from a backend API
  useEffect(() => {
    // In a real app, we'd fetch users from the backend
    // For now, we'll use our dummy data
    setUsers(dummyUsers);
  }, []);

  const visibleUsers = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const idx = (currentIndex + i) % users.length;
      result.push(users[idx]);
    }
    return result;
  };

  // Return the actual JSX component
  return (
    <section className="py-12 bg-pharmacy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-pharmacy-dark">Nos Utilisateurs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les pharmaciens et fournisseurs qui utilisent déjà Elsaidaliya pour simplifier leurs approvisionnements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleUsers().map((user) => (
            <Card key={user.id} className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="h-3 bg-pharmacy-accent"></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {user.role === "pharmacien" ? (
                      <div className="w-10 h-10 rounded-full bg-pharmacy-light flex items-center justify-center">
                        <User size={24} className="text-pharmacy-dark" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pharmacy-light flex items-center justify-center">
                        <Store size={24} className="text-pharmacy-dark" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                      <Badge variant={user.role === "pharmacien" ? "outline" : "default"} className={user.role === "pharmacien" ? "bg-pharmacy-light text-pharmacy-dark" : "bg-pharmacy-accent"}>
                        {user.role === "pharmacien" ? "Pharmacien" : "Fournisseur"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mt-3">
                  <MapPin size={16} className="mr-1 text-pharmacy-accent" />
                  <span className="text-sm">{user.wilaya}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {users.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${currentIndex === idx || (currentIndex + 1) % users.length === idx || (currentIndex + 2) % users.length === idx ? 'bg-pharmacy-accent' : 'bg-gray-300'}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsersCarousel;

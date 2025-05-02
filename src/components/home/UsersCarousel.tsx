
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  },
];

const UsersCarousel = () => {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
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
  
  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Utilisateurs</h2>
        
        <div className="relative">
          <div className="flex space-x-6 animate-slide transition-transform duration-500">
            {visibleUsers().map(user => (
              <div 
                key={user.id} 
                className="min-w-[300px] p-6 bg-gradient-to-br from-pharmacy-light to-white rounded-xl shadow-lg transform transition-transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-pharmacy-accent flex items-center justify-center overflow-hidden">
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }} 
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-600">
                      {user.role === 'pharmacien' ? 'Pharmacien' : 'Fournisseur'} • {user.wilaya}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  {user.role === 'pharmacien' 
                    ? "Recherche et trouve facilement des médicaments grâce à Elsaidaliya." 
                    : "Offre ses produits à de nombreux pharmaciens via notre plateforme."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsersCarousel;

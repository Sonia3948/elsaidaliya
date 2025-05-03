
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  role: string;
  image: string;
  wilaya: string;
};

const dummyUsers = [{
  id: "1",
  name: "Pharmacie Centrale",
  role: "pharmacien",
  image: "/placeholder.svg",
  wilaya: "Alger"
}, {
  id: "2",
  name: "Med Supply",
  role: "fournisseur",
  image: "/placeholder.svg",
  wilaya: "Oran"
}, {
  id: "3",
  name: "Santé Plus",
  role: "pharmacien",
  image: "/placeholder.svg",
  wilaya: "Constantine"
}, {
  id: "4",
  name: "Pharma Solutions",
  role: "fournisseur",
  image: "/placeholder.svg",
  wilaya: "Annaba"
}, {
  id: "5",
  name: "Laboratoire El Kendi",
  role: "fournisseur",
  image: "/placeholder.svg",
  wilaya: "Blida"
}];

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

  // Fixed the component by adding a return statement with JSX
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Utilisateurs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez comment les pharmaciens et les fournisseurs à travers l'Algérie utilisent notre plateforme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleUsers().map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{user.role} - {user.wilaya}</p>
                </div>
              </div>
              <p className="text-gray-600">
                {user.role === "pharmacien" 
                  ? "Trouve facilement ses médicaments grâce à notre plateforme." 
                  : "Connecté avec des pharmacies dans toute l'Algérie."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsersCarousel;

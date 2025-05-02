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
  const {
    toast
  } = useToast();
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
  return;
};
export default UsersCarousel;
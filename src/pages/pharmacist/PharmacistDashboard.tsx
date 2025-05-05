
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, FileText, Image, Users, Clock, ArrowRight, Star, Bell, FileCheck, Building, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RegistrationNotice from "@/components/notifications/RegistrationNotice";

// Types for our data
interface Medicine {
  id: number;
  name: string;
  supplier: {
    id: number;
    name: string;
    pdfUrl: string;
    productCount: number;
  };
}

interface Supplier {
  id: number;
  name: string;
  wilaya: string;
  rating: number;
  isFavorite: boolean;
  productCount: number;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  supplier: {
    id: number;
    name: string;
  };
  date: string;
}

interface Notification {
  id: number;
  type: "offer" | "product";
  supplierName: string;
  title: string;
  date: string;
  read: boolean;
}

interface Listing {
  id: number;
  title: string;
  supplierName: string;
  supplierID: number;
  medicationCount: number;
}

const PharmacistDashboard = () => {
  // States
  const [stats, setStats] = useState({
    searchesThisMonth: 0,
    suppliersViewed: 0,
    offersViewed: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [listingResults, setListingResults] = useState<Listing[]>([]);
  const [topSuppliers, setTopSuppliers] = useState<Supplier[]>([]);
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMedicineResults, setShowMedicineResults] = useState(false);
  const [isUserActive, setIsUserActive] = useState(true);

  // Mock data fetch on component mount
  useEffect(() => {
    // Simuler la vérification du statut d'activation de l'utilisateur
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsUserActive(user.isActive !== undefined ? user.isActive : true);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }

    // Simulate fetching stats
    const mockStats = {
      searchesThisMonth: 28,
      suppliersViewed: 15,
      offersViewed: 22,
    };
    setStats(mockStats);

    // Simulate fetching top suppliers
    const mockTopSuppliers = [
      { id: 1, name: "MediStock Algérie", wilaya: "Alger", rating: 4.8, isFavorite: true, productCount: 245 },
      { id: 2, name: "PharmaSupply", wilaya: "Oran", rating: 4.6, isFavorite: false, productCount: 198 },
      { id: 3, name: "MedProvision", wilaya: "Constantine", rating: 4.5, isFavorite: true, productCount: 176 },
      { id: 4, name: "HealthDistributors", wilaya: "Annaba", rating: 4.3, isFavorite: false, productCount: 154 },
    ];
    setTopSuppliers(mockTopSuppliers);

    // Simulate fetching recent offers
    const mockRecentOffers = [
      { 
        id: 1, 
        title: "Promotion sur les antibiotiques", 
        description: "20% de réduction sur toute la gamme d'antibiotiques", 
        imageUrl: "/placeholder.svg", 
        supplier: { id: 1, name: "MediStock Algérie" },
        date: "Il y a 2 jours"
      },
      { 
        id: 2, 
        title: "Offre spéciale antihistaminiques", 
        description: "Achetez 10 boîtes, obtenez-en 2 gratuites", 
        imageUrl: "/placeholder.svg", 
        supplier: { id: 2, name: "PharmaSupply" },
        date: "Il y a 3 jours"
      },
      { 
        id: 3, 
        title: "Nouveaux produits dermatologiques", 
        description: "Découvrez notre nouvelle gamme de produits dermatologiques", 
        imageUrl: "/placeholder.svg", 
        supplier: { id: 3, name: "MedProvision" },
        date: "Il y a 5 jours"
      },
    ];
    setRecentOffers(mockRecentOffers);

    // Simulate fetching notifications
    const mockNotifications = [
      { 
        id: 1, 
        type: "offer" as const, 
        supplierName: "MediStock Algérie", 
        title: "Nouvelle offre spéciale", 
        date: "Aujourd'hui", 
        read: false 
      },
      { 
        id: 2, 
        type: "product" as const, 
        supplierName: "PharmaSupply", 
        title: "Nouveaux produits disponibles", 
        date: "Hier", 
        read: true 
      },
      { 
        id: 3, 
        type: "offer" as const, 
        supplierName: "MedProvision", 
        title: "Promotion sur les antibiotiques", 
        date: "Il y a 3 jours", 
        read: true 
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  // Handle medicine search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowMedicineResults(true);
      
      // Simulate API call to search for medicines
      const mockResults = [
        { id: 1, name: "Paracétamol 500mg", supplier: { id: 1, name: "MediStock Algérie", pdfUrl: "/sample.pdf", productCount: 245 } },
        { id: 2, name: "Paracétamol 1g", supplier: { id: 2, name: "PharmaSupply", pdfUrl: "/sample.pdf", productCount: 198 } },
        { id: 3, name: "Paracétamol sirop", supplier: { id: 3, name: "MedProvision", pdfUrl: "/sample.pdf", productCount: 176 } },
        { id: 4, name: "Ibuprofène 400mg", supplier: { id: 1, name: "MediStock Algérie", pdfUrl: "/sample.pdf", productCount: 245 } },
        { id: 5, name: "Aspirine 100mg", supplier: { id: 4, name: "HealthDistributors", pdfUrl: "/sample.pdf", productCount: 154 } },
      ];
      setSearchResults(mockResults);
      
      // Simuler les listings contenant ce médicament
      const mockListings = [
        { id: 1, title: "Catalogue Printemps 2023", supplierName: "MediStock Algérie", supplierID: 1, medicationCount: 120 },
        { id: 2, title: "Produits Populaires", supplierName: "PharmaSupply", supplierID: 2, medicationCount: 85 },
        { id: 3, title: "Médicaments Génériques", supplierName: "MedProvision", supplierID: 3, medicationCount: 150 }
      ];
      setListingResults(mockListings);
    }
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Toggle favorite supplier
  const toggleFavorite = (id: number) => {
    setTopSuppliers(topSuppliers.map(supplier => 
      supplier.id === id ? { ...supplier, isFavorite: !supplier.isFavorite } : supplier
    ));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <DashboardLayout userRole="pharmacist">
      <div className="p-6">
        {!isUserActive && (
          <div className="mb-6">
            <RegistrationNotice role="pharmacist" />
          </div>
        )}
      
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de Bord Pharmacien</h1>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab("notifications")}>
              <Bell size={18} />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="listings">📦 Médicaments</TabsTrigger>
            <TabsTrigger value="offers">🎁 Offres</TabsTrigger>
            <TabsTrigger value="suppliers">🏪 Fournisseurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Dashboard Statistics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recherches</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.searchesThisMonth}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fournisseurs consultés</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.suppliersViewed}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Offres consultées</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.offersViewed}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm">Vous avez recherché "Paracétamol"</p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm">Vous avez consulté le profil de "MediStock"</p>
                      <p className="text-xs text-gray-500">Il y a 1 jour</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm">Vous avez consulté une offre spéciale</p>
                      <p className="text-xs text-gray-500">Il y a 2 jours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Offers Preview */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Dernières offres disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentOffers.slice(0, 3).map((offer) => (
                  <Card key={offer.id} className="overflow-hidden">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <img src={offer.imageUrl} alt={offer.title} className="h-full w-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{offer.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">{offer.supplier.name}</span>
                        <Link to={`/pharmacist/offers/${offer.id}`}>
                          <Button variant="link" className="p-0 h-auto">
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => setActiveTab("offers")}>
                  Voir toutes les offres <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recherche de Médicaments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher un médicament..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                  <Button onClick={handleSearch}>Rechercher</Button>
                </div>
                
                {showMedicineResults && (
                  <>
                    {searchResults.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Médicaments trouvés</h3>
                        <div className="space-y-4">
                          {searchResults.slice(0, 5).map((medicine) => (
                            <Card key={medicine.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{medicine.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Fournisseur: {medicine.supplier.name}
                                  </p>
                                </div>
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={medicine.supplier.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                      <FileText size={16} className="mr-1" /> Catalogue
                                    </a>
                                  </Button>
                                  <Button size="sm" asChild>
                                    <Link to={`/pharmacist/suppliers/${medicine.supplier.id}`} className="flex items-center">
                                      <Building size={16} className="mr-1" /> Profil
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {listingResults.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Listings contenant ce médicament</h3>
                        <div className="space-y-4">
                          {listingResults.map((listing) => (
                            <Card key={listing.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{listing.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Fournisseur: {listing.supplierName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {listing.medicationCount} médicaments dans ce catalogue
                                  </p>
                                </div>
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/pharmacist/listings/${listing.id}`} className="flex items-center">
                                      <FileText size={16} className="mr-1" /> Voir le listing
                                    </Link>
                                  </Button>
                                  <Button size="sm" asChild>
                                    <Link to={`/pharmacist/suppliers/${listing.supplierID}`} className="flex items-center">
                                      <Building size={16} className="mr-1" /> Voir fournisseur
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
                      
            <Card>
              <CardHeader>
                <CardTitle>Fournisseurs les plus populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSuppliers.map((supplier) => (
                    <Card key={supplier.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{supplier.name}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <p>{supplier.productCount} produits</p>
                            <span className="mx-2">•</span>
                            <p>Wilaya: {supplier.wilaya}</p>
                          </div>
                          <div className="flex items-center mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < Math.floor(supplier.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">{supplier.rating}</span>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleFavorite(supplier.id)}
                            className={supplier.isFavorite ? "bg-pharmacy-light text-pharmacy-dark" : ""}
                          >
                            <Star
                              size={16}
                              className={`mr-1 ${supplier.isFavorite ? "fill-pharmacy-dark" : ""}`}
                            />
                            {supplier.isFavorite ? "Favori" : "Ajouter aux favoris"}
                          </Button>
                          <Button size="sm" asChild>
                            <Link to={`/pharmacist/suppliers/${supplier.id}`} className="flex items-center">
                              <Building size={16} className="mr-1" /> Voir profil
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentOffers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden flex flex-col">
                  <div className="h-48 bg-gray-100">
                    <img src={offer.imageUrl} alt={offer.title} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{offer.description}</p>
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <span>{offer.date}</span>
                      <span className="mx-1">•</span>
                      <span>{offer.supplier.name}</span>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 border-t mt-auto">
                    <Button className="w-full" asChild>
                      <Link to={`/pharmacist/offers/${offer.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recherche de Fournisseurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Nom du fournisseur..." className="max-w-md" />
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-gray-400" />
                    <Link to="/pharmacist/wilaya-search" className="text-pharmacy-accent hover:underline">
                      Rechercher par wilaya
                    </Link>
                  </div>
                </div>
                <Button className="mt-4">Rechercher</Button>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Résultats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topSuppliers.map((supplier) => (
                      <Card key={supplier.id} className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-semibold">{supplier.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(supplier.id)}
                                className={supplier.isFavorite ? "text-yellow-500" : "text-gray-400"}
                              >
                                <Star
                                  size={16}
                                  className={supplier.isFavorite ? "fill-yellow-500" : ""}
                                />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">Wilaya: {supplier.wilaya}</p>
                            <div className="flex items-center mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(supplier.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                />
                              ))}
                              <span className="ml-1 text-sm">{supplier.rating}</span>
                            </div>
                            <div className="mt-3">
                              <Button size="sm" asChild>
                                <Link to={`/pharmacist/suppliers/${supplier.id}`}>
                                  Voir profil
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border rounded-lg ${notification.read ? "bg-white" : "bg-pharmacy-light/10"}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          {notification.type === "offer" ? (
                            <div className="h-10 w-10 rounded-full bg-pharmacy-light flex items-center justify-center text-pharmacy-dark flex-shrink-0">
                              <Image size={20} />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <FileCheck size={20} />
                            </div>
                          )}
                          
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.date}</span>
                            </div>
                            <p className="text-sm text-gray-600">De {notification.supplierName}</p>
                            
                            <div className="mt-2">
                              <Button size="sm" variant="link" className="p-0 h-auto">
                                Voir détails
                              </Button>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <Badge variant="destructive" className="ml-2 h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">Aucune notification</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;

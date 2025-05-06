import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, FileText, Package, Gift, Users, Clock, ArrowRight, Bell, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RegistrationNotice from "@/components/notifications/RegistrationNotice";
import { notificationService } from "@/services/notification";
import { offerService } from "@/services/offer";
import { listingService } from "@/services/listing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PharmacistDashboard = () => {
  // States
  const [isUserActive, setIsUserActive] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState<any[]>([]);

  // Get user stats
  const {
    data: stats
  } = useQuery({
    queryKey: ["pharmacistStats"],
    queryFn: async () => {
      // In a real application, fetch from backend
      return {
        searchesThisMonth: 28,
        suppliersViewed: 15,
        offersViewed: 22
      };
    }
  });

  // Get recent offers
  const {
    data: recentOffers,
    isLoading: offersLoading
  } = useQuery({
    queryKey: ["recentOffers"],
    queryFn: async () => {
      const response = await offerService.getAllOffers({
        limit: "3",
        sort: "createdAt"
      });
      return response.offers || [];
    }
  });

  // Get popular listings
  const {
    data: popularListings,
    isLoading: listingsLoading
  } = useQuery({
    queryKey: ["popularListings"],
    queryFn: async () => {
      const response = await listingService.getAllListings({
        limit: "3",
        sort: "viewCount"
      });
      return response.listings || [];
    }
  });

  // Get user notifications
  const {
    data: userNotifications,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: async () => {
      const response = await notificationService.getUserNotifications();
      return response.notifications || [];
    }
  });
  useEffect(() => {
    if (userNotifications) {
      setNotifications(userNotifications);
    }
  }, [userNotifications]);

  // Check user status
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsUserActive(user.isActive !== undefined ? user.isActive : true);
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notif => notif.id === id ? {
        ...notif,
        read: true
      } : notif));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;
  return <DashboardLayout userRole="pharmacien">
    <div className="p-6">
      {!isUserActive && <div className="mb-6">
          <RegistrationNotice role="pharmacien" />
        </div>}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de Bord Pharmacien</h1>
        <div className="relative">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setActiveTab("notifications")}>
            <Bell size={18} />
            Notifications
            {unreadCount > 0 && <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recherches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.searchesThisMonth || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fournisseurs consultés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.suppliersViewed || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offres consultées</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.offersViewed || 0}</div>
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
                    <p className="text-sm">Vous avez consulté le profil d'un fournisseur</p>
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
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Package className="h-10 w-10 text-green-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Rechercher des Médicaments</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Trouvez rapidement les médicaments dont vous avez besoin
                  </p>
                  <Button asChild>
                    <Link to="/pharmacist/listings">Accéder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Gift className="h-10 w-10 text-purple-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Voir les Offres</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Découvrez les dernières promotions et offres spéciales
                  </p>
                  <Button asChild>
                    <Link to="/pharmacist/offers">Accéder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Building className="h-10 w-10 text-amber-600 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Trouver des Fournisseurs</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Recherchez des fournisseurs par nom ou wilaya
                  </p>
                  <Button asChild>
                    <Link to="/pharmacist/suppliers">Accéder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Offers Preview */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Dernières offres disponibles</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pharmacist/offers" className="flex items-center">
                  Voir toutes <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {offersLoading ? <p className="text-center my-4">Chargement des offres...</p> : recentOffers && recentOffers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentOffers.map((offer: any) => <Card key={offer.id} className="overflow-hidden">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      {offer.imageUrl ? <img src={offer.imageUrl} alt={offer.title} className="h-full w-full object-cover" /> : <Gift className="h-12 w-12 text-gray-300" />}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{offer.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          {offer.supplier?.name || "Fournisseur"}
                        </span>
                        <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                          <Link to={`/pharmacist/offers/${offer.id}`}>
                            Voir détails
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>)}
            </div> : <p className="text-center my-4">Aucune offre disponible</p>}
          </div>
          
          {/* Popular Listings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Listings populaires</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pharmacist/listings" className="flex items-center">
                  Voir tous <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {listingsLoading ? <p className="text-center my-4">Chargement des listings...</p> : popularListings && popularListings.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {popularListings.map((listing: any) => <Card key={listing.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="font-medium">{listing.title}</h3>
                      <div className="text-sm text-gray-600 mt-2">
                        <p>
                          {listing.medications?.length || 0} médicaments disponibles
                        </p>
                        <p className="mt-1">
                          Fournisseur: {listing.supplierName || "Non spécifié"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={listing.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <FileText className="mr-1 h-4 w-4" /> Voir PDF
                          </a>
                        </Button>
                        <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                          <Link to={`/pharmacist/suppliers/${listing.supplierID}`}>
                            Profil fournisseur
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>)}
            </div> : <p className="text-center my-4">Aucun listing disponible</p>}
          </div>
        </TabsContent>
        
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Recherche de Médicaments</span>
                <Button asChild>
                  <Link to="/pharmacist/listings">
                    Accéder à la page de recherche
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                Accédez à notre base de données complète
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Recherchez des médicaments par nom et consultez les PDF des listings pour trouver les produits dont vous avez besoin.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Offres Disponibles</span>
                <Button asChild>
                  <Link to="/pharmacist/offers">
                    Voir toutes les offres
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                Découvrez les meilleures offres du moment
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Des offres spéciales, des promotions et des nouveaux produits sont régulièrement publiés par nos fournisseurs partenaires.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Fournisseurs</span>
                <Button asChild>
                  <Link to="/pharmacist/suppliers">
                    Rechercher des fournisseurs
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                Trouvez les meilleurs fournisseurs
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Recherchez des fournisseurs par nom ou wilaya, ajoutez-les à vos favoris et notez leur service pour aider la communauté.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? <div className="space-y-4">
                  {notifications.map(notification => <div key={notification.id} className={`p-4 border rounded-lg ${notification.read ? "bg-white" : "bg-green-50"}`} onClick={() => markAsRead(notification.id)}>
                      <div className="flex items-start">
                        {notification.type === "offer" ? <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <Gift size={20} />
                          </div> : notification.type === "listing" ? <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                            <Package size={20} />
                          </div> : <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Bell size={20} />
                          </div>}
                        
                        <div className="ml-3 flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.description}
                          </p>
                          
                          {notification.fromName && <p className="text-sm text-gray-500 mt-1">
                              De: {notification.fromName}
                            </p>}
                          
                          <div className="mt-2">
                            <Button size="sm" variant="link" className="p-0 h-auto">
                              Voir détails
                            </Button>
                          </div>
                        </div>
                        
                        {!notification.read && <Badge variant="destructive" className="ml-2 h-2 w-2 rounded-full p-0" />}
                      </div>
                    </div>)}
              </div> : <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>Vous n'avez aucune notification pour le moment.</p>
              </div>}
              
              {notifications.length > 0 && <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => {
                // Mark all as read
                notifications.forEach(n => !n.read && markAsRead(n.id));
                refetchNotifications();
              }}>
                    Marquer toutes comme lues
                  </Button>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>;
};

export default PharmacistDashboard;

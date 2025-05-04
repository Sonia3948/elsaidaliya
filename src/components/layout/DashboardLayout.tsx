import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Home,
  User,
  Settings,
  LayoutDashboard,
  FileText,
  Image,
  Search,
  Users,
  ShieldCheck,
  File
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: ReactNode;
  userRole: "admin" | "pharmacist" | "supplier";
};

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "Utilisateur");
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate("/login");
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Utilisateurs", href: "/admin/users", icon: Users },
          { name: "Fournisseurs", href: "/admin/suppliers", icon: ShieldCheck },
          { name: "Pharmaciens", href: "/admin/pharmacists", icon: User },
        ];
      case "supplier":
        return [
          { name: "Tableau de bord", href: "/supplier/dashboard", icon: LayoutDashboard },
          { name: "Listings", href: "/supplier/listings", icon: FileText },
          { name: "Offres", href: "/supplier/offers", icon: Image },
          { name: "Profil", href: "/supplier/profile", icon: User },
        ];
      case "pharmacist":
        return [
          { name: "Tableau de bord", href: "/pharmacist/dashboard", icon: LayoutDashboard },
          { name: "Recherche Médicaments", href: "/pharmacist/medicines", icon: Search },
          { name: "Offres Disponibles", href: "/pharmacist/offers", icon: Image },
          { name: "Recherche Fournisseurs", href: "/pharmacist/suppliers", icon: Users },
          { name: "Profil", href: "/pharmacist/profile", icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  
  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    return location.pathname.startsWith(href);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-gray-50 w-full">
        <Sidebar>
          <SidebarHeader>
            <Link to="/" className="flex items-center pl-2">
              <img 
                src="/lovable-uploads/416db742-a6a0-481e-8bf5-91b997537eae.png" 
                alt="Elsaidaliya Logo" 
                className="h-8 w-auto" 
              />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild tooltip={item.name}>
                        <Link 
                          to={item.href}
                          className={cn(
                            isActiveLink(item.href) 
                              ? "bg-pharmacy-light text-pharmacy-dark font-medium" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          <item.icon className={cn(
                            "mr-2 h-5 w-5",
                            isActiveLink(item.href) ? "text-pharmacy-dark" : ""
                          )} />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600"
                title="Se déconnecter"
              >
                <LogOut size={20} />
              </Button>
            </div>
            <div className="px-4 py-2 flex justify-between">
              <Link to="/" className="text-gray-500 hover:text-medical">
                <Home size={20} />
              </Link>
              <Link to={`/${userRole}/profile`} className={cn(
                "text-gray-500 hover:text-medical",
                isActiveLink(`/${userRole}/profile`) ? "text-pharmacy-dark" : ""
              )}>
                <Settings size={20} />
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header with sidebar trigger */}
          <div className="bg-white shadow-sm z-10 md:hidden">
            <div className="h-16 flex items-center px-4">
              <SidebarTrigger />
              <div className="ml-4">
                <img 
                  src="/lovable-uploads/416db742-a6a0-481e-8bf5-91b997537eae.png" 
                  alt="Elsaidaliya Logo" 
                  className="h-8 w-auto" 
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

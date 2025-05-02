
import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  FileText,
  Image,
  Search,
  Users,
  ShieldCheck,
  Award,
  Star,
  Medal,
  Trophy,
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

type DashboardLayoutProps = {
  children: ReactNode;
  userRole: "admin" | "pharmacist" | "supplier";
};

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                        <Link to={item.href}>
                          <item.icon className="mr-2 h-5 w-5" />
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
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white shadow-sm z-10">
            <div className="h-16 flex items-center justify-between px-4 md:px-6">
              <div className="flex items-center md:hidden">
                <SidebarTrigger />
              </div>
              <div className="flex items-center space-x-4 ml-auto">
                <Link to="/" className="text-gray-500 hover:text-medical">
                  <Home size={20} />
                </Link>
                <Link to={`/${userRole}/profile`} className="text-gray-500 hover:text-medical">
                  <Settings size={20} />
                </Link>
                <div className="border-l border-gray-200 h-6 mx-2"></div>
                <div className="flex items-center md:hidden">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userName} />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

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

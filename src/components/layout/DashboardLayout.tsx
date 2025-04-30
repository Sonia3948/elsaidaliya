
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

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
    // In a real app, check if the user is authenticated and get their role
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } hidden md:block bg-white shadow-sm transition-all duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {isSidebarOpen ? (
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                <span className="ml-2 font-bold text-gray-900">Med-Supply-Link</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center justify-center w-full">
                <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-900"
            >
              {isSidebarOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-medical-light hover:text-medical-dark"
                >
                  <item.icon
                    className="mr-3 h-6 w-6 text-gray-500 group-hover:text-medical-dark"
                    aria-hidden="true"
                  />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              {isSidebarOpen && (
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
              )}
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
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-64 w-full bg-white">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="h-8 w-8 rounded-full bg-medical-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MS</span>
                </div>
                <span className="ml-2 font-bold text-gray-900">Med-Supply-Link</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-medical-light hover:text-medical-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 text-gray-500 group-hover:text-medical-dark"
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
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
                >
                  <LogOut size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-500 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
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
  );
};

export default DashboardLayout;

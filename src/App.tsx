
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminPayments from "./pages/admin/AdminPayments";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import SupplierListings from "./pages/supplier/SupplierListings";
import SupplierOffers from "./pages/supplier/SupplierOffers";
import SupplierProfile from "./pages/supplier/SupplierProfile";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import PharmacistMedicines from "./pages/pharmacist/PharmacistMedicines";
import PharmacistOffers from "./pages/pharmacist/PharmacistOffers";
import PharmacistSuppliers from "./pages/pharmacist/PharmacistSuppliers";
import PharmacistProfile from "./pages/pharmacist/PharmacistProfile";
import PharmacistListings from "./pages/pharmacist/PharmacistListings";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LegalPage from "./pages/LegalPage";
import AdminLoginPage from "./pages/AdminLoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payment/:offerId" element={<PaymentPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          
          {/* Supplier Routes */}
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier/listings" element={<SupplierListings />} />
          <Route path="/supplier/offers" element={<SupplierOffers />} />
          <Route path="/supplier/profile" element={<SupplierProfile />} />
          <Route path="/supplier/:id" element={<SupplierProfile />} />
          
          {/* Pharmacist Routes */}
          <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
          <Route path="/pharmacist/listings" element={<PharmacistListings />} />
          <Route path="/pharmacist/medicines" element={<PharmacistMedicines />} />
          <Route path="/pharmacist/offers" element={<PharmacistOffers />} />
          <Route path="/pharmacist/suppliers" element={<PharmacistSuppliers />} />
          <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
          <Route path="/pharmacist/offers/:id" element={<PharmacistOffers />} />
          <Route path="/pharmacist/suppliers/:id" element={<PharmacistSuppliers />} />
          <Route path="/pharmacist/history" element={<PharmacistDashboard />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

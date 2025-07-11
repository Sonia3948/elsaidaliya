
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));

// Supplier pages
const SupplierDashboard = lazy(() => import("./pages/supplier/SupplierDashboard"));
const SupplierListings = lazy(() => import("./pages/supplier/SupplierListings"));
const SupplierOffers = lazy(() => import("./pages/supplier/SupplierOffers"));
const SupplierProfile = lazy(() => import("./pages/supplier/SupplierProfile"));
const SupplierSubscription = lazy(() => import("./pages/supplier/SupplierSubscription"));

// Pharmacist pages
const PharmacistDashboard = lazy(() => import("./pages/pharmacist/PharmacistDashboard"));
const PharmacistMedicines = lazy(() => import("./pages/pharmacist/PharmacistMedicines"));
const PharmacistSuppliers = lazy(() => import("./pages/pharmacist/PharmacistSuppliers"));
const PharmacistOffers = lazy(() => import("./pages/pharmacist/PharmacistOffers"));
const PharmacistProfile = lazy(() => import("./pages/pharmacist/PharmacistProfile"));

// Other pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pharmacy-dark" />
      <p className="text-gray-600">Chargement...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/payment" element={<PaymentPage />} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <AuthGuard requiredRole="admin">
                    <AdminDashboard />
                  </AuthGuard>
                } />
                <Route path="/admin/users" element={
                  <AuthGuard requiredRole="admin">
                    <AdminUsers />
                  </AuthGuard>
                } />
                <Route path="/admin/payments" element={
                  <AuthGuard requiredRole="admin">
                    <AdminPayments />
                  </AuthGuard>
                } />
                <Route path="/admin/profile" element={
                  <AuthGuard requiredRole="admin">
                    <AdminProfile />
                  </AuthGuard>
                } />

                {/* Supplier routes */}
                <Route path="/supplier/dashboard" element={
                  <AuthGuard requiredRole="fournisseur">
                    <SupplierDashboard />
                  </AuthGuard>
                } />
                <Route path="/supplier/listings" element={
                  <AuthGuard requiredRole="fournisseur">
                    <SupplierListings />
                  </AuthGuard>
                } />
                <Route path="/supplier/offers" element={
                  <AuthGuard requiredRole="fournisseur">
                    <SupplierOffers />
                  </AuthGuard>
                } />
                <Route path="/supplier/profile" element={
                  <AuthGuard requiredRole="fournisseur">
                    <SupplierProfile />
                  </AuthGuard>
                } />
                <Route path="/supplier/subscription" element={
                  <AuthGuard requiredRole="fournisseur">
                    <SupplierSubscription />
                  </AuthGuard>
                } />

                {/* Pharmacist routes */}
                <Route path="/pharmacist/dashboard" element={
                  <AuthGuard requiredRole="pharmacien">
                    <PharmacistDashboard />
                  </AuthGuard>
                } />
                <Route path="/pharmacist/medicines" element={
                  <AuthGuard requiredRole="pharmacien">
                    <PharmacistMedicines />
                  </AuthGuard>
                } />
                <Route path="/pharmacist/suppliers" element={
                  <AuthGuard requiredRole="pharmacien">
                    <PharmacistSuppliers />
                  </AuthGuard>
                } />
                <Route path="/pharmacist/offers" element={
                  <AuthGuard requiredRole="pharmacien">
                    <PharmacistOffers />
                  </AuthGuard>
                } />
                <Route path="/pharmacist/profile" element={
                  <AuthGuard requiredRole="pharmacien">
                    <PharmacistProfile />
                  </AuthGuard>
                } />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

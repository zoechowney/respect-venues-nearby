
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VenueOwnerAuthProvider } from "@/contexts/VenueOwnerAuthContext";
import Index from "./pages/Index";
import JoinMovement from "./pages/JoinMovement";
import Map from "./pages/Map";
import Directory from "./pages/Directory";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import CodeOfConduct from "./pages/CodeOfConduct";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import DataRights from "./pages/DataRights";
import VenueOwnerAuth from "./pages/VenueOwnerAuth";
import VenueOwnerDashboard from "./pages/VenueOwnerDashboard";
import QRLanding from "./pages/QRLanding";
import Sponsors from "./pages/Sponsors";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VenueOwnerAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/join" element={<JoinMovement />} />
                <Route path="/map" element={<Map />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/sponsors" element={<Sponsors />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/code-of-conduct" element={<CodeOfConduct />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/data-rights" element={<DataRights />} />
                <Route path="/venue-owner/auth" element={<VenueOwnerAuth />} />
                <Route path="/venue-owner/dashboard" element={<VenueOwnerDashboard />} />
                <Route path="/qr/:businessName" element={<QRLanding />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </VenueOwnerAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

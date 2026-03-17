import { Toaster } from "@livestock/components/ui/toaster";
import { Toaster as Sonner } from "@livestock/components/ui/sonner";
import { TooltipProvider } from "@livestock/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Animals from "./pages/Animals";
import Health from "./pages/Health";
import Tracking from "./pages/Tracking";
import FeedPlanner from "./pages/FeedPlanner";
import DiseaseDetection from "./pages/DiseaseDetection";
import Environment from "./pages/Environment";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LivestockApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/health" element={<Health />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/feed" element={<FeedPlanner />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/environment" element={<Environment />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default LivestockApp;


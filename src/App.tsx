
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TranscribePage from "./pages/TranscribePage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticlesPage from "./pages/ArticlesPage";
import AITrainingPage from "./pages/AITrainingPage";
import ArticlesManagementPage from "./pages/ArticlesManagementPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import ReformulatePage from "./pages/ReformulatePage";
import IntegrationsPage from "./pages/IntegrationsPage";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider delayDuration={0}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/transcribe" element={
                <AuthGuard>
                  <TranscribePage />
                </AuthGuard>
              } />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/new-article" element={<CreateArticlePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/manage" element={
                <AuthGuard>
                  <ArticlesManagementPage />
                </AuthGuard>
              } />
              <Route path="/settings/profile" element={
                <AuthGuard>
                  <ProfileSettingsPage />
                </AuthGuard>
              } />
              <Route path="/ai-training" element={
                <AuthGuard>
                  <AITrainingPage />
                </AuthGuard>
              } />
              <Route path="/reformulate" element={<ReformulatePage />} />
              <Route path="/integrations" element={
                <AuthGuard>
                  <IntegrationsPage />
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

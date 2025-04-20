import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider delayDuration={0}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/transcribe" element={<TranscribePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/new-article" element={<CreateArticlePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/manage" element={<ArticlesManagementPage />} />
            <Route path="/settings/profile" element={<ProfileSettingsPage />} />
            <Route path="/ai-training" element={<AITrainingPage />} />
            <Route path="/reformulate" element={<ReformulatePage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

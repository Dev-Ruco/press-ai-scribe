
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TranscribePage from "./pages/TranscribePage";
import CreateTranscriptionPage from "./pages/CreateTranscriptionPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticlesPage from "./pages/ArticlesPage";
import AITrainingPage from "./pages/AITrainingPage";
import ArticlesManagementPage from "./pages/ArticlesManagementPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import CreateNewsroomPage from "./pages/CreateNewsroomPage";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";

const App = () => {
  const queryClient = new QueryClient();
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={0}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/transcribe" element={
                <AuthGuard allowView={true}>
                  <TranscribePage />
                </AuthGuard>
              } />
              <Route path="/transcribe/new" element={
                <AuthGuard requireAuth={true}>
                  <CreateTranscriptionPage />
                </AuthGuard>
              } />
              <Route path="/news" element={
                <AuthGuard allowView={true}>
                  <NewsPage />
                </AuthGuard>
              } />
              <Route path="/new-article" element={
                <AuthGuard allowView={true}>
                  <CreateArticlePage />
                </AuthGuard>
              } />
              <Route path="/articles" element={
                <AuthGuard allowView={true}>
                  <ArticlesPage />
                </AuthGuard>
              } />
              <Route path="/articles/manage" element={
                <AuthGuard allowView={true}>
                  <ArticlesManagementPage />
                </AuthGuard>
              } />
              <Route path="/settings/profile" element={
                <AuthGuard allowView={false}>
                  <ProfileSettingsPage />
                </AuthGuard>
              } />
              <Route path="/ai-training" element={
                <AuthGuard allowView={true}>
                  <AITrainingPage />
                </AuthGuard>
              } />
              <Route path="/integrations" element={
                <AuthGuard allowView={true}>
                  <IntegrationsPage />
                </AuthGuard>
              } />
              <Route path="/create-newsroom" element={
                <AuthGuard allowView={false}>
                  <CreateNewsroomPage />
                </AuthGuard>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;

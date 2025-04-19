
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TranscribePage from "./pages/TranscribePage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import CreateArticlePage from "./pages/CreateArticlePage";
import ArticlesPage from "./pages/ArticlesPage";

const App = () => {
  // Create QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider delayDuration={0}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transcribe" element={<TranscribePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/new-article" element={<CreateArticlePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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

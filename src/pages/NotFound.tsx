
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { language, t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="h-full flex flex-col items-center justify-center pt-10">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            {language === 'pt-MZ' ? "Página não encontrada" : "Page not found"}
          </p>
          <p className="text-muted-foreground mb-8">
            {language === 'pt-MZ' 
              ? "A página que você está procurando não existe ou foi movida." 
              : "The page you are looking for doesn't exist or has been moved."}
          </p>
          <a href="/" className="text-primary hover:text-primary/80 underline underline-offset-4">
            {language === 'pt-MZ' ? "Voltar para o início" : "Back to home"}
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;

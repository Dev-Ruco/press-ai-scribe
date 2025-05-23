
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FilePlus, RefreshCw, ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export function WelcomeSection() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [greeting, setGreeting] = useState("Olá");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);
  
  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "";
  };
  
  if (user) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary-dark">
              {greeting}, {getUserDisplayName()} 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Bem-vindo ao seu painel de controle Press AI
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Button 
              variant="default"
              size="sm"
              onClick={() => navigate("/new-article")}
              className="gap-2"
            >
              <FilePlus className="h-4 w-4" />
              <span>Criar Artigo</span>
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate("/reformulate")}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reformular Artigo</span>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-8 text-white shadow-xl overflow-hidden relative mb-8 text-center"
    >
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo ao Press AI
        </h1>
        <p className="text-gray-300 max-w-xl mb-6">
          A plataforma de IA editorial que converte notas, áudio ou documentos em artigos prontos para publicar, poupando até 70% do seu tempo.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="sm"
            onClick={() => setAuthDialogOpen(true)}
            className="gap-2 bg-white text-gray-900 hover:bg-gray-100 group"
          >
            <span>Entrar</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/features")}
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            Explorar Funcionalidades
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 bg-blue-500/10 rounded-full blur-xl" />
      
      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </motion.div>
  );
}

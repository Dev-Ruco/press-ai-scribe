
import { Button } from "@/components/ui/button";
import { FilePlus, RefreshCw, Headphones } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

export function QuickActions() {
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    if (!user) {
      setPendingAction(path);
      setPromptOpen(true);
    } else {
      navigate(path);
    }
  };

  const trigger = (icon: React.ReactNode, text: string, path: string) => (
    <Button
      className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
      onClick={() => handleAction(path)}
    >
      {icon}
      <span>{text}</span>
    </Button>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        {trigger(<FilePlus size={18} />, "Criar Artigo", "/new-article")}
        {trigger(<RefreshCw size={18} />, "Importar Notícias", "/news")}
        {trigger(<Headphones size={18} />, "Transcrever Áudio", "/transcribe")}
      </div>
      <AuthPrompt 
        isOpen={promptOpen} 
        onClose={() => setPromptOpen(false)} 
      />
    </>
  );
}


import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilePlus, RefreshCw, Headphones, Settings, Newspaper } from "lucide-react";
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

  const actionItems = [
    {
      icon: <FilePlus size={22} />,
      text: "Criar Artigo",
      path: "/new-article",
      primary: true
    },
    {
      icon: <RefreshCw size={22} />,
      text: "Importar Notícias",
      path: "/news",
      primary: false
    },
    {
      icon: <Headphones size={22} />,
      text: "Transcrever Áudio",
      path: "/transcribe",
      primary: false
    },
    {
      icon: <Newspaper size={22} />,
      text: "Ver Artigos",
      path: "/articles",
      primary: false
    },
    {
      icon: <Settings size={22} />,
      text: "Configurações",
      path: "/settings/profile",
      primary: false
    }
  ];

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-800">Acesso Rápido</h2>
        <Separator className="bg-neutral-200" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4">
          {actionItems.map((item, index) => (
            <Button
              key={index}
              variant={item.primary ? "default" : "outline"}
              className={`h-auto py-5 w-full flex-col gap-3 ${
                item.primary 
                  ? "bg-neutral-900 hover:bg-neutral-800 text-white" 
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
              onClick={() => handleAction(item.path)}
            >
              <div className={`w-14 h-14 rounded-full ${
                item.primary ? "bg-white/20" : "bg-neutral-100"
              } flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="text-base">{item.text}</span>
            </Button>
          ))}
        </div>
      </div>
      <AuthPrompt 
        isOpen={promptOpen} 
        onClose={() => setPromptOpen(false)} 
      />
    </>
  );
}

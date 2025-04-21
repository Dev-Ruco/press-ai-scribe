
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <FilePlus size={20} />,
      text: "Criar Artigo",
      path: "/new-article",
      primary: true
    },
    {
      icon: <RefreshCw size={20} />,
      text: "Importar Notícias",
      path: "/news",
      primary: false
    },
    {
      icon: <Headphones size={20} />,
      text: "Transcrever Áudio",
      path: "/transcribe",
      primary: false
    },
    {
      icon: <Newspaper size={20} />,
      text: "Ver Artigos",
      path: "/articles",
      primary: false
    },
    {
      icon: <Settings size={20} />,
      text: "Configurações",
      path: "/settings/profile",
      primary: false
    }
  ];

  return (
    <>
      <Card className="bg-bg-white border-border shadow-light">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-primary-dark">Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {actionItems.map((item, index) => (
              <Button
                key={index}
                variant={item.primary ? "default" : "outline"}
                className={`h-auto py-4 w-full flex-col gap-3 ${
                  item.primary 
                    ? "bg-primary hover:bg-primary-dark text-white" 
                    : "border-primary/50 text-primary hover:bg-primary/10"
                }`}
                onClick={() => handleAction(item.path)}
              >
                <div className={`w-12 h-12 rounded-full ${
                  item.primary ? "bg-white/20" : "bg-primary/10"
                } flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-sm">{item.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <AuthPrompt 
        isOpen={promptOpen} 
        onClose={() => setPromptOpen(false)} 
      />
    </>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, RefreshCw, Headphones, Settings, Newspaper, ChevronRight, Zap, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function QuickActions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    authDialogOpen,
    setAuthDialogOpen,
    requireAuth,
  } = useProgressiveAuth();

  const handleAction = (path: string) => {
    console.log("Navigate to:", path);
    requireAuth(() => navigate(path));
  };

  const actionItems = [
    {
      icon: <ChevronRight size={20} />,
      text: "Continuar Rascunho",
      path: "/articles",
      primary: false
    },
    {
      icon: <Zap size={20} />,
      text: "Gerar Novo Artigo",
      path: "/new-article",
      primary: true
    },
    {
      icon: <Plus size={20} />,
      text: "Adicionar Nova Fonte",
      path: "/news",
      primary: false
    },
  ];

  return (
    <>
      <Card className="bg-bg-white border-border shadow-light">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-primary-dark">Sugestões de Ação Imediata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actionItems.map((item, index) => (
              <Button
                key={index}
                variant={item.primary ? "default" : "outline"}
                className={`h-auto py-4 w-full flex-col gap-3 ${
                  item.primary 
                    ? "bg-primary hover:bg-primary/90 text-white" 
                    : "border-primary/20 text-primary hover:bg-primary/5"
                }`}
                onClick={() => handleAction(item.path)}
              >
                <div className={`w-12 h-12 rounded-full ${
                  item.primary ? "bg-white/20" : "bg-primary/10"
                } flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        actionAfterAuth={() => {/* The action will be handled by useProgressiveAuth */}}
      />
    </>
  );
}

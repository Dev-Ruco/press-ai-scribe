
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";

export function OnboardingTutorial() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const tutorialItems = [
    {
      title: "Adicione Fontes",
      description: "Use o editor para receber títulos, leads e estruturas completas, tudo com sugestões inteligentes.",
      icon: "📰",
      imageUrl: "/lovable-uploads/tutorial-sources.gif" // Placeholder for now
    },
    {
      title: "Gere Artigo em Dois Cliques",
      description: "Cole qualquer texto e reformule com o tom ou objetivo que desejar.",
      icon: "✏️", 
      imageUrl: "/lovable-uploads/tutorial-article.gif" // Placeholder for now
    },
    {
      title: "Organize e Publique",
      description: "Forneça links confiáveis e o sistema acompanhará novas matérias automaticamente.",
      icon: "📂",
      imageUrl: "/lovable-uploads/tutorial-publish.gif" // Placeholder for now
    }
  ];

  return (
    <Card className="mb-6 bg-bg-white border-border shadow-light">
      <CardHeader className="pb-2 flex flex-row gap-2 items-center">
        <Sparkles className="text-primary" size={24} />
        <CardTitle className="text-primary-dark text-lg">
          Tutorial interativo – Como usar o Press AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorialItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-lg overflow-hidden shadow-md h-32 w-full bg-gray-100 flex items-center justify-center">
                {/* Placeholder for GIF/Image */}
                <span className="text-4xl">{item.icon}</span>
              </div>
              <h3 className="font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary mb-4">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex flex-col items-center">
          <Button 
            className="px-8 py-6 text-lg" 
            onClick={() => setAuthDialogOpen(true)}
          >
            Experimente Gratuitamente
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Sem custos de arranque • Cancelamento fácil • Acesso imediato
          </p>
        </div>
      </CardContent>

      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Card>
  );
}

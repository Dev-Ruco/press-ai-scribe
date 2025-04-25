
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Satellite, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function OnboardingTutorial() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Monitorização de Fontes",
      description: "Adicione websites de referência e receba as últimas notícias filtradas pelo seu critério.",
      icon: Satellite,
      color: "from-purple-500 to-indigo-600",
      glow: "bg-purple-400/20",
    },
    {
      title: "Geração Automática de Artigos",
      description: "Carregue textos, áudios ou imagens e deixe a nossa IA sugerir um rascunho completo.",
      icon: FileText,
      color: "from-cyan-500 to-blue-600",
      glow: "bg-cyan-400/20",
    },
    {
      title: "Rascunhos e Edição Colaborativa",
      description: "Guarde automaticamente o seu trabalho, edite em tempo real e publique com um clique.",
      icon: Layers,
      color: "from-emerald-500 to-teal-600",
      glow: "bg-emerald-400/20",
    }
  ];

  return (
    <Card className="mb-6 backdrop-blur-md bg-white/80 border-white/20 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-emerald-500/10 opacity-30 pointer-events-none" />
      
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h3 className="font-medium">Tutorial Futurista — Destaques de Funcionalidades</h3>
        </div>
        <div className="flex gap-1">
          {tutorialSteps.map((_, index) => (
            <button 
              key={index} 
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeStep === index ? "bg-primary w-6" : "bg-primary/30"
              )}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {tutorialSteps.map((step, index) => (
            <div 
              key={index} 
              className={cn(
                "relative p-6 transition-all duration-500 backdrop-blur-sm flex flex-col items-center text-center justify-between h-full",
                activeStep === index ? "opacity-100 scale-100" : "opacity-60 scale-95",
                `hover:opacity-100 hover:scale-100`
              )}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div 
                className={cn(
                  "absolute inset-0 opacity-10 pointer-events-none",
                  step.glow
                )} 
              />
              
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className={cn(
                  "mb-6 rounded-full p-4 relative",
                  "bg-gradient-to-br",
                  step.color
                )}>
                  <div className="absolute inset-0 rounded-full animate-pulse bg-white/20 blur-md" />
                  <step.icon className="w-8 h-8 text-white relative z-10" />
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                "bg-gradient-to-r",
                step.color,
                activeStep === index ? "opacity-100" : "opacity-0"
              )} />
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-transparent to-white/40">
          <Button 
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg shadow-blue-500/20 relative overflow-hidden group"
            onClick={() => setAuthDialogOpen(true)}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <span className="relative z-10">Experimente Gratuitamente</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse" />
          </Button>
          <p className="text-xs text-gray-500 mt-3 opacity-80">
            Sem custos de arranque • Cancelamento fácil • Acesso imediato
          </p>
        </div>
      </CardContent>

      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Card>
  );
}

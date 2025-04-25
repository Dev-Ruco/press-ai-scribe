
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Satellite, FileText, Layers, Link2, Database, Image, FileAudio } from "lucide-react";
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
      color: "from-foreground to-primary-dark",
      glow: "bg-foreground/20",
    },
    {
      title: "Geração Automática de Artigos",
      description: "Carregue textos, áudios ou imagens e deixe a nossa IA sugerir um rascunho completo.",
      icon: FileText,
      color: "from-primary-dark to-primary",
      glow: "bg-primary/20",
    },
    {
      title: "Publicação e Integração",
      description: "Publique diretamente em plataformas como WordPress e redes sociais, ou integre com seu site. Press AI é seu aliado, não um substituto.",
      icon: Link2,
      color: "from-primary to-primary-light",
      glow: "bg-primary-light/20",
    },
    {
      title: "IA Personalizada",
      description: "A IA aprende com sua base de artigos existente, adaptando-se ao seu estilo e padrões editoriais.",
      icon: Database,
      color: "from-primary-dark to-primary",
      glow: "bg-primary/20",
    },
    {
      title: "IA para Imagens",
      description: "Potencialize seu artigo: deixe a IA gerar imagens, sugerir fotos da nossa galeria ou buscar imagens relacionadas ao tema.",
      icon: Image,
      color: "from-foreground to-primary-dark",
      glow: "bg-foreground/20",
    },
    {
      title: "Transcrição Inteligente",
      description: "Transforme áudios e vídeos em texto editável, com reconhecimento de fala e identificação de diferentes locutores.",
      icon: FileAudio,
      color: "from-primary-dark to-primary",
      glow: "bg-primary/20",
    }
  ];

  return (
    <Card className="mb-6 backdrop-blur-md bg-white/5 border-white/10 shadow-futuristic overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 via-primary/5 to-primary-light/5 opacity-30 pointer-events-none" />
      
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-foreground h-5 w-5" />
          <h3 className="font-medium text-foreground">Como posso te ajudar?</h3>
        </div>
        <div className="flex gap-1">
          {tutorialSteps.map((_, index) => (
            <button 
              key={index} 
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeStep === index ? "bg-foreground w-6" : "bg-foreground/30"
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
                <h3 className="text-xl font-medium mb-3 text-foreground">{step.title}</h3>
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
        
        <div className="flex flex-col items-center p-6 bg-gradient-to-b from-transparent to-foreground/5">
          <Button 
            className="px-8 py-6 text-lg bg-gradient-to-r from-foreground to-primary hover:opacity-90 text-background hover:bg-primary-dark border-0 shadow-minimal relative overflow-hidden group" 
            onClick={() => setAuthDialogOpen(true)}
          >
            <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span className="relative z-10">Experimente Gratuitamente</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-3 opacity-80">
            Sem custos de arranque • Cancelamento fácil • Acesso imediato
          </p>
        </div>
      </CardContent>

      <AuthDialog isOpen={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </Card>
  );
}

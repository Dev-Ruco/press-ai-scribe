
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

export function ProductivityTip() {
  const [tip, setTip] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    "Ative o 'Modo de Sugestões Avançadas' para acelerar as suas revisões.",
    "Use atalhos de teclado (Ctrl+S) para salvar rapidamente seus rascunhos.",
    "Configure alertas de novas matérias para receber notificações automáticas.",
    "Experimente a função de transcrição para converter áudios em textos editáveis.",
    "Treine a IA com exemplos do seu estilo para resultados mais personalizados."
  ];
  
  useEffect(() => {
    // Get a random tip for the day
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTipIndex(randomIndex);
    setTip(tips[randomIndex]);
  }, []);
  
  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-gradient-to-r from-amber-50 to-amber-100/80 border-amber-100/50">
      <CardHeader className="pb-2 flex flex-row items-center space-x-2 z-10">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-amber-400/30 blur-md" />
          <Lightbulb className="h-5 w-5 text-amber-500 relative" />
        </div>
        <h3 className="text-amber-700 text-sm font-medium">Dica de Produtividade do Dia</h3>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-amber-800 relative">
          {tip}
          <span className="absolute -bottom-4 -right-1 text-5xl text-amber-200/50 font-bold opacity-30">
            {tipIndex + 1}
          </span>
        </p>
      </CardContent>
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-300/20 to-transparent rounded-bl-3xl" />
      <div className="absolute bottom-0 left-0 h-8 w-1/3 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-tr-xl" />
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

export function ProductivityTip() {
  const [tip, setTip] = useState("");
  
  const tips = [
    "Ative o 'Modo de Sugestões Avançadas' para acelerar as suas revisões.",
    "Use atalhos de teclado (Ctrl+S) para salvar rapidamente seus rascunhos.",
    "Configure alertas de novas matérias para receber notificações automáticas.",
    "Experimente a função de transcrição para converter áudios em textos editáveis.",
    "Treine a IA com exemplos do seu estilo para resultados mais personalizados."
  ];
  
  useEffect(() => {
    // Get a random tip for the day
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);
  
  return (
    <Card className="bg-amber-50 border-amber-100">
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <CardTitle className="text-amber-700 text-sm font-medium">Dica de Produtividade do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-800">{tip}</p>
      </CardContent>
    </Card>
  );
}

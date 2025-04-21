
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function OnboardingTutorial() {
  return (
    <Card className="mb-6 bg-bg-white border-border shadow-light">
      <CardHeader className="pb-2 flex flex-row gap-2 items-center">
        <Sparkles className="text-primary" size={24} />
        <CardTitle className="text-primary-dark text-lg">
          Tutorial interativo – Como usar o Press AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc text-sm pl-5 text-text-secondary space-y-2">
          <li><b>Gerar artigos com IA</b>: Use o editor para receber títulos, leads e estruturas completas, tudo com sugestões inteligentes.</li>
          <li><b>Reformule textos em novos estilos</b>: Cole qualquer texto e reformule com o tom ou objetivo que desejar.</li>
          <li><b>Adicione fontes de notícias</b>: Forneça links confiáveis e o sistema acompanhará novas matérias automaticamente.</li>
          <li><b>Transcreva áudios ou links</b>: Faça upload, grave ou cole links de áudio e receba transcrições instantâneas.</li>
          <li><b>Treine a IA no seu estilo</b>: Suba exemplos ou defina preferências de tom para personalizar a IA editorial.</li>
        </ul>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LearningEvent {
  id: string;
  title: string;
  time: string;
  type: "concept" | "term" | "improvement";
  description: string;
}

export function RecentLearnings() {
  // Mock data for recent learnings
  const learnings: LearningEvent[] = [
    {
      id: "1",
      title: "Novo Conceito: Meta-jornalismo",
      time: "Há 2 horas",
      type: "concept",
      description: "Aprendido o conceito de meta-jornalismo como análise crítica da produção jornalística."
    },
    {
      id: "2",
      title: "Melhorias na Estrutura de Notícias Económicas",
      time: "Há 5 horas",
      type: "improvement",
      description: "Refinamento do formato de apresentação de dados financeiros em notícias económicas."
    },
    {
      id: "3",
      title: "Nova Terminologia: 'Taxa de Bounce'",
      time: "Há 1 dia",
      type: "term",
      description: "Incorporação do conceito de taxa de bounce em análises de engajamento de conteúdo."
    }
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "concept":
        return <Brain className="h-5 w-5" />;
      case "term":
        return <Book className="h-5 w-5" />;
      case "improvement":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Informações de Aprendizagem Recentes
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="ml-auto"
          >
            <Link to="/ai-training" className="gap-2">
              Treino da IA
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {learnings.map((learning) => (
            <div 
              key={learning.id} 
              className="flex gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="mt-1 p-1.5 rounded-full bg-primary/10 h-fit text-primary">
                {getIconForType(learning.type)}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{learning.title}</h4>
                <p className="text-xs text-muted-foreground">{learning.description}</p>
                <p className="text-xs text-muted-foreground/70">{learning.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


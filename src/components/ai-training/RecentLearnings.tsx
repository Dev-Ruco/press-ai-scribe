
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function RecentLearnings() {
  const { user } = useAuth();
  
  // Sem dados simulados para usuários não autenticados
  const learnings = [];

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
        {!user ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Faça login para ver informações de aprendizagem.</p>
          </div>
        ) : learnings.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Nenhuma informação de aprendizagem encontrada.</p>
            <p className="text-sm mt-2">Adicione documentos ao treino da IA para começar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {learnings.map((learning) => (
              <div 
                key={learning.id} 
                className="flex gap-3 p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="mt-1 p-1.5 rounded-full bg-primary/10 h-fit text-primary">
                  {/* Implemente o getIconForType aqui se necessário */}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">{learning.title}</h4>
                  <p className="text-xs text-muted-foreground">{learning.description}</p>
                  <p className="text-xs text-muted-foreground/70">{learning.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

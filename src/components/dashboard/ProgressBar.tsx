
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export function ProgressBar() {
  // Mock data for user progress
  const progress = 75;
  const goal = 100;
  
  // Mock badges
  const badges = [
    { name: "📰 Leitor Regular", achieved: true },
    { name: "🚀 Velocista", achieved: true },
    { name: "🔍 Investigador", achieved: false },
    { name: "✏️ Editor Master", achieved: false }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Progresso e Reconhecimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Meta mensal: {progress}/{goal} artigos</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Distintivos</div>
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, i) => (
              <div 
                key={i} 
                className={`
                  text-xs px-3 py-1 rounded-full 
                  ${badge.achieved 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'bg-muted text-muted-foreground border border-muted'}
                `}
              >
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const mockNews = [
  {
    id: 1,
    title: "Impacto da IA no Jornalismo",
    excerpt: "Como a inteligência artificial está transformando a produção de conteúdo...",
    source: "TechNews",
    time: "2h atrás"
  },
  {
    id: 2,
    title: "Novas Tendências em Redação Digital",
    excerpt: "O mercado editorial está passando por mudanças significativas...",
    source: "Digital Trends",
    time: "3h atrás"
  },
  {
    id: 3,
    title: "O Futuro do Conteúdo Digital",
    excerpt: "Análise das principais tendências que moldarão o futuro...",
    source: "Future Media",
    time: "4h atrás"
  }
];

export function RecentNewsList() {
  const handleNewsClick = (newsContent: string) => {
    // Futuramente: Implementar a lógica para inserir o conteúdo no editor
    console.log("Notícia selecionada:", newsContent);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {mockNews.map((news) => (
          <div
            key={news.id}
            className="p-4 border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
            onClick={() => handleNewsClick(news.excerpt)}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium mb-1">{news.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {news.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

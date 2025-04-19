
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles, Clock } from "lucide-react";
import { ArticleAssistant } from "./ArticleAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ArticleToolsMenu() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);

  const recentNews = [{
    id: "1",
    title: "Nova política econômica anunciada pelo governo",
    time: "2h atrás"
  }, {
    id: "2",
    title: "Avanços na pesquisa sobre energias renováveis",
    time: "3h atrás"
  }, {
    id: "3",
    title: "Descoberta arqueológica importante no norte do país",
    time: "4h atrás"
  }];

  return (
    <div className="space-y-2">
      <Collapsible
        open={isAssistantOpen}
        onOpenChange={setIsAssistantOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Assistente IA</span>
            </div>
            {isAssistantOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ArticleAssistant />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={isNewsOpen}
        onOpenChange={setIsNewsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Últimas Notícias</span>
            </div>
            {isNewsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Últimas Notícias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="group">
                    <a href="#" className="block group-hover:text-primary transition-colors">
                      <h3 className="text-sm font-medium line-clamp-2">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-text-secondary text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{news.time}</span>
                      </div>
                    </a>
                    {news.id !== "3" && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

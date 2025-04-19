import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
export function ArticleAssistant() {
  const [message, setMessage] = useState("");

  // Sample recent news data
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
  return <div className="space-y-6">
      <Card className="my-[89px]">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Assistente IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="min-h-[200px] max-h-[300px] overflow-y-auto border rounded-lg p-4 mb-2">
              <p className="text-text-secondary text-sm">
                Olá! Como posso ajudar com seu artigo hoje?
              </p>
            </div>
            <div className="flex gap-2">
              <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1" />
              <Button size="icon" disabled={!message}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="my-0">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Últimas Notícias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNews.map(news => <div key={news.id} className="group">
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
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
}
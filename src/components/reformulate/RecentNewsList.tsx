
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function RecentNewsList() {
  // Não há notícias mockadas
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="text-center text-muted-foreground py-8">
          Nenhuma notícia encontrada. Importe fontes de notícias para começar!
        </div>
      </div>
    </ScrollArea>
  );
}

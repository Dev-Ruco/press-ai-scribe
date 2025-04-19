
import { Clock } from "lucide-react";

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

export function SidePanelNews() {
  return (
    <div className="p-4 space-y-4">
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
          {news.id !== "3" && <div className="h-px bg-border mt-4" />}
        </div>
      ))}
    </div>
  );
}

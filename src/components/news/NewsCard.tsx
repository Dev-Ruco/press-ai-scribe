
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';

interface NewsCardProps {
  news: {
    id: number;
    title: string;
    category: string;
    source: string;
    time: string;
    date: string;
  };
}

export const NewsCard = ({ news }: NewsCardProps) => {
  const navigate = useNavigate();

  const handleReformulate = () => {
    // Se estivermos na página de novo artigo, navegue para reformular com a notícia
    if (window.location.pathname === '/new-article') {
      navigate('/reformulate', { 
        state: { title: news.title } 
      });
    } else {
      // Se já estivermos em outra página, apenas reformule diretamente
      // Aqui você pode adicionar lógica adicional conforme necessário
      console.log("Reformulando:", news.title);
    }
  };

  return (
    <div className="p-6 border-b border-border hover:bg-accent/20 transition-colors">
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span className="bg-bg-gray px-2.5 py-1 rounded-full">{news.category}</span>
        <span className="text-primary">{news.source}</span>
      </div>
      
      <h2 className="text-xl font-medium text-text-primary mb-4">{news.title}</h2>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-text-secondary text-sm">
          <Clock size={16} className="mr-1" />
          <span className="mr-2">{news.time}</span>
          <span>{news.date}</span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-primary hover:bg-primary/10 transition-all duration-200 hover:shadow-sm"
                onClick={handleReformulate}
              >
                <RefreshCw size={16} />
                <span>Reformular</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reformular esta notícia</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

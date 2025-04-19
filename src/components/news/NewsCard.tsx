import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
export const NewsCard = ({
  news
}: NewsCardProps) => {
  return <div className="p-6 border-b border-border hover:bg-bg-gray transition-colors">
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span className="bg-bg-gray px-2.5 py-1 rounded-full">{news.category}</span>
        <span className="text-primary">{news.source}</span>
      </div>
      
      <h2 className="text-xl font-medium text-text-primary mb-4">{news.title}</h2>
      
      <div className="flex items-center justify-between bg-zinc-50">
        <div className="flex items-center text-text-secondary text-sm">
          <Clock size={16} className="mr-1" />
          <span className="mr-2">{news.time}</span>
          <span>{news.date}</span>
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-zinc-950 bg-zinc-50">
          <RefreshCw size={16} />
          <span className="text-primary-DEFAULT">Reformular</span>
        </Button>
      </div>
    </div>;
};
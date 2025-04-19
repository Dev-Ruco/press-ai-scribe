
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

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
    // Se estivermos na página de novo artigo
    if (window.location.pathname === '/new-article' || window.location.pathname === '/reformulate') {
      // Tentar encontrar o textarea específico pelo ID
      const mainTextarea = document.getElementById('main-content-textarea') as HTMLTextAreaElement;
      
      // Se encontrou o textarea específico
      if (mainTextarea && mainTextarea instanceof HTMLTextAreaElement) {
        try {
          // Salva a posição atual do cursor
          const startPos = mainTextarea.selectionStart || 0;
          const endPos = mainTextarea.selectionEnd || 0;
          
          // Obtém o conteúdo atual
          const currentValue = mainTextarea.value;
          
          // Insere o título no local do cursor ou ao final se não houver cursor
          const newValue = currentValue.substring(0, startPos) + news.title + currentValue.substring(endPos);
          
          // Define o novo valor
          mainTextarea.value = newValue;
          
          // Coloca o foco no textarea
          mainTextarea.focus();
          
          // Simula o evento de input para disparar atualizações de estado React
          const inputEvent = new Event('input', { bubbles: true });
          mainTextarea.dispatchEvent(inputEvent);
          
          // Também dispare o evento change para garantir
          const changeEvent = new Event('change', { bubbles: true });
          mainTextarea.dispatchEvent(changeEvent);
          
          // Feedback visual para o usuário
          toast({
            title: "Notícia adicionada",
            description: "Título da notícia inserido no editor",
          });
          
          console.log("Texto inserido com sucesso:", news.title);
        } catch (error) {
          console.error("Erro ao inserir texto:", error);
          
          // Feedback de erro
          toast({
            title: "Erro ao inserir texto",
            description: "Não foi possível inserir o texto no editor",
            variant: "destructive"
          });
        }
      } else {
        console.log("Textarea principal não encontrado, buscando alternativas...");
        
        // Se não encontrar o textarea específico, busca qualquer textarea disponível
        const textareas = document.querySelectorAll('textarea');
        
        if (textareas.length > 0) {
          const textarea = textareas[0] as HTMLTextAreaElement;
          
          try {
            // Salva a posição atual do cursor
            const startPos = textarea.selectionStart || 0;
            const endPos = textarea.selectionEnd || 0;
            
            // Obtém o conteúdo atual
            const currentValue = textarea.value;
            
            // Insere o título no local do cursor ou ao final se não houver cursor
            const newValue = currentValue.substring(0, startPos) + news.title + currentValue.substring(endPos);
            
            // Define o novo valor
            textarea.value = newValue;
            
            // Coloca o foco no textarea
            textarea.focus();
            
            // Simula o evento de input para disparar atualizações de estado React
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            
            // Também dispare o evento change para garantir
            const changeEvent = new Event('change', { bubbles: true });
            textarea.dispatchEvent(changeEvent);
            
            // Feedback visual para o usuário
            toast({
              title: "Notícia adicionada",
              description: "Título da notícia inserido no editor",
            });
            
            console.log("Texto inserido em textarea alternativo:", news.title);
          } catch (error) {
            console.error("Erro ao inserir texto em textarea alternativo:", error);
            
            // Feedback de erro
            toast({
              title: "Erro ao inserir texto",
              description: "Não foi possível inserir o texto no editor",
              variant: "destructive"
            });
            
            // Navegar para reformulação como fallback
            if (window.location.pathname !== '/reformulate') {
              navigate('/reformulate', { 
                state: { title: news.title } 
              });
              
              toast({
                title: "Redirecionando",
                description: "Indo para a página de reformulação",
              });
            }
          }
        } else {
          console.log("Nenhum textarea encontrado na página");
          
          // Se não encontrar textarea, navega para página de reformulação
          if (window.location.pathname !== '/reformulate') {
            navigate('/reformulate', { 
              state: { title: news.title } 
            });
            
            toast({
              title: "Redirecionando",
              description: "Indo para a página de reformulação",
            });
          } else {
            // Estamos na página de reformulação mas não encontramos o textarea
            toast({
              title: "Erro",
              description: "Não foi possível inserir o texto no editor",
              variant: "destructive"
            });
          }
        }
      }
    } else {
      // Se estivermos em outra página, navegamos para reformulação
      navigate('/reformulate', { 
        state: { title: news.title } 
      });
      
      toast({
        title: "Redirecionando",
        description: "Indo para a página de reformulação",
      });
    }
  };

  return (
    <div className="p-6 border-b border-border hover:bg-accent/20 transition-colors">
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span className="bg-bg-gray px-2.5 py-1 rounded-full">{news.category}</span>
        <span className="text-primary">{news.source}</span>
      </div>
      
      <h2 className="text-xl font-medium text-text-primary mb-4 cursor-pointer hover:text-primary transition-colors" 
          onClick={handleReformulate}>
        {news.title}
      </h2>
      
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

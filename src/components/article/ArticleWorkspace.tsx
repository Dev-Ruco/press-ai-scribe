
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Edit, Save, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Article type options for selection
const ARTICLE_TYPES = [
  { id: "news", label: "Notícia" },
  { id: "report", label: "Reportagem" },
  { id: "opinion", label: "Opinião" },
  { id: "chronicle", label: "Crónica" },
  { id: "press-release", label: "Comunicado" },
  { id: "editorial", label: "Editorial" },
  { id: "event-report", label: "Relatório de Evento" }
];

// Sample title suggestions
const SAMPLE_TITLES = [
  "A transformação energética de Moçambique",
  "Moçambique avança em direção às energias renováveis",
  "O futuro energético de Moçambique: desafios e oportunidades",
  "Crise energética: Moçambique busca alternativas sustentáveis",
  "Energia para todos: O plano de Moçambique para 2030"
];

// Sample lead suggestions
const SAMPLE_LEADS = [
  { 
    type: "informative", 
    text: "Moçambique ampliou em 45% seus investimentos em energia renovável no último ano, segundo relatório divulgado pelo Ministério de Energia nesta quarta-feira. O documento indica crescimento significativo em projetos solares nas províncias do norte."
  },
  { 
    type: "emotional", 
    text: "Em meio a uma crise energética que deixa milhões de moçambicanos sem acesso à eletricidade, surge uma luz de esperança nas comunidades rurais de Nampula. Painéis solares transformam vidas e reacendem sonhos de desenvolvimento."
  },
  { 
    type: "direct", 
    text: "O governo moçambicano anunciou ontem investimentos de 120 milhões de euros em energia renovável. O projeto deve beneficiar cerca de 150 mil pessoas em 200 comunidades rurais até o final de 2025."
  },
  { 
    type: "creative", 
    text: "Entre o sol que abrasa as planícies do norte e os ventos que varrem a costa leste, Moçambique encontrou suas novas fontes de poder. A revolução energética silenciosa que está mudando o perfil do país africano começa nas comunidades mais remotas."
  }
];

export function ArticleWorkspace({ workflowState, onWorkflowUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [articleContent, setArticleContent] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLead, setSelectedLead] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Generate mock content based on the step
    if (workflowState.step === "type-selection" && workflowState.isProcessing) {
      // Simulate AI analyzing content
      const timer = setTimeout(() => {
        onWorkflowUpdate({ 
          isProcessing: false,
        });
        
        toast({
          title: "Análise concluída",
          description: "Material analisado com sucesso. Que tipo de artigo deseja elaborar?"
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [workflowState.step, workflowState.isProcessing]);

  const handleSelectArticleType = (type) => {
    onWorkflowUpdate({ 
      articleType: type,
      step: "title-selection",
      isProcessing: true
    });
    
    // Simulate AI generating titles
    setTimeout(() => {
      onWorkflowUpdate({ isProcessing: false });
    }, 1500);
  };

  const handleSelectTitle = (title) => {
    setSelectedTitle(title);
    onWorkflowUpdate({ 
      title: title,
      step: "content-editing",
      isProcessing: true
    });
    
    // Simulate AI generating content
    setTimeout(() => {
      // Generate sample content based on the title
      const sampleContent = `# ${title}\n\n${SAMPLE_LEADS[0].text}\n\n## Contexto Atual\n\nMoçambique enfrenta desafios significativos no setor energético, com apenas 34% da população tendo acesso à eletricidade. As disparidades entre áreas urbanas (65%) e rurais (22%) destacam a necessidade de soluções inovadoras.\n\n## Principais Desenvolvimentos\n\nO ano de 2023 marcou um avanço significativo, com o aumento de 45% nos investimentos em energia renovável. Projetos de destaque incluem:\n\n- Parque solar de Mocuba, com capacidade de 40MW\n- Iniciativas de microgeração em comunidades isoladas\n- Projetos piloto de energia eólica na região costeira\n\n## Perspectivas Futuras\n\nEspecialistas preveem que, mantido o ritmo atual de investimentos, Moçambique poderá atingir 60% de energia renovável em sua matriz até 2030, posicionando o país como líder regional em sustentabilidade energética.`;
      
      setArticleContent(sampleContent);
      onWorkflowUpdate({ isProcessing: false });
    }, 2000);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      toast({
        title: "Modo de edição ativado",
        description: "Agora você pode editar diretamente o conteúdo."
      });
    }
  };

  const handleContentChange = (e) => {
    setArticleContent(e.target.value);
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Rascunho salvo",
      description: "Seu artigo foi salvo como rascunho com sucesso."
    });
  };

  const handleApproveForPublication = () => {
    onWorkflowUpdate({ step: "finalization" });
    toast({
      title: "Artigo aprovado",
      description: "Seu artigo foi aprovado para publicação."
    });
  };

  const renderWorkflowStep = () => {
    if (workflowState.isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-60 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Processando conteúdo...</p>
        </div>
      );
    }

    switch (workflowState.step) {
      case "type-selection":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
              <h2 className="text-xl font-medium">Material analisado com sucesso</h2>
              <p className="text-muted-foreground">Que tipo de artigo deseja elaborar?</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {ARTICLE_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  className="px-6 py-2 h-auto"
                  onClick={() => handleSelectArticleType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        );
        
      case "title-selection":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
              <h2 className="text-xl font-medium">Sugestões de Título</h2>
              <p className="text-muted-foreground">Selecione um dos títulos sugeridos ou edite-o conforme necessário</p>
            </div>
            
            <div className="space-y-4">
              {SAMPLE_TITLES.map((title, index) => (
                <div key={index} className="border rounded-md p-4 hover:border-primary transition-all hover:bg-primary/5">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{title}</p>
                    <Button 
                      size="sm"
                      onClick={() => handleSelectTitle(title)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Selecionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "content-editing":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selectedTitle}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={handleToggleEditMode}
              >
                <Edit className="h-4 w-4" />
                {editMode ? "Concluir Edição" : "Editar"}
              </Button>
            </div>
            
            {editMode ? (
              <textarea
                className="w-full min-h-[500px] p-4 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                value={articleContent}
                onChange={handleContentChange}
              />
            ) : (
              <div 
                className="prose prose-slate max-w-none dark:prose-invert p-4 border rounded-md min-h-[500px] bg-background"
                onClick={handleToggleEditMode}
              >
                <div dangerouslySetInnerHTML={{ 
                  __html: articleContent
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\n- (.*$)/gm, '<ul><li>$1</li></ul>')
                }} />
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleSaveAsDraft}>
                <Save className="h-4 w-4 mr-2" />
                Guardar como rascunho
              </Button>
              <Button onClick={handleApproveForPublication}>
                <Send className="h-4 w-4 mr-2" />
                Aprovar para publicação
              </Button>
            </div>
          </div>
        );
        
      case "finalization":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <h2 className="text-xl font-medium text-green-700">Artigo aprovado para publicação</h2>
              <p className="text-green-600">Seu artigo foi aprovado e está pronto para ser publicado.</p>
            </div>
            
            <div className="border rounded-md p-6">
              <h3 className="font-medium mb-4">Publicar em:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="wordpress" className="mr-2" defaultChecked />
                  <label htmlFor="wordpress">WordPress (Site Principal)</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="social" className="mr-2" />
                  <label htmlFor="social">Redes Sociais</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="newsletter" className="mr-2" />
                  <label htmlFor="newsletter">Newsletter</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="whatsapp" className="mr-2" />
                  <label htmlFor="whatsapp">WhatsApp Business</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="pdf" className="mr-2" />
                  <label htmlFor="pdf">Exportar como PDF/DOCX</label>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full">
                  Publicar Agora
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return <p>Estado desconhecido: {workflowState.step}</p>;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border/30 p-6">
      {renderWorkflowStep()}
    </div>
  );
}

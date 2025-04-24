import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, Edit, Save, Send, X, 
  Plus, FileText, Copy, ListOrdered 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cleanMarkers } from "@/lib/textUtils";

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
  const [editingTitle, setEditingTitle] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const articleRef = useRef(null);
  const { user } = useAuth();
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
    
    // Simulate AI generating content with better formatting
    setTimeout(() => {
      // Generate sample content based on the title
      const sampleContent = cleanMarkers(`# ${title}

${SAMPLE_LEADS[0].text}

## Contexto Atual

Moçambique enfrenta desafios significativos no setor energético, com apenas 34% da população tendo acesso à eletricidade. As disparidades entre áreas urbanas (65%) e rurais (22%) destacam a necessidade de soluções inovadoras.

## Principais Desenvolvimentos

O ano de 2023 marcou um avanço significativo, com o aumento de 45% nos investimentos em energia renovável. Projetos de destaque incluem:

- Parque solar de Mocuba, com capacidade de 40MW
- Iniciativas de microgeração em comunidades isoladas
- Projetos piloto de energia eólica na região costeira

## Perspectivas Futuras

Especialistas preveem que, mantido o ritmo atual de investimentos, Moçambique poderá atingir 60% de energia renovável em sua matriz até 2030, posicionando o país como líder regional em sustentabilidade energética.`);
      
      setArticleContent(sampleContent);
      onWorkflowUpdate({ isProcessing: false });
    }, 2000);
  };

  const handleEditTitle = (title) => {
    setEditingTitle(title);
  };

  const handleSaveEditedTitle = () => {
    if (editingTitle.trim()) {
      handleSelectTitle(editingTitle);
      setEditingTitle("");
    }
  };

  const handleCancelEditTitle = () => {
    setEditingTitle("");
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

  const handleToggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
  };

  const handleContentChange = (e) => {
    setArticleContent(e.target.value);
  };

  const handleSaveAsDraft = async () => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para salvar artigos",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // This is just a simulation since we don't have an actual table yet
      // In a real implementation, you would save to the articles table
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Rascunho salvo",
        description: "Seu artigo foi salvo como rascunho com sucesso."
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o rascunho",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveForPublication = () => {
    onWorkflowUpdate({ step: "finalization" });
    toast({
      title: "Artigo aprovado",
      description: "Seu artigo foi aprovado para publicação."
    });
  };

  const handleAddTranscriptionToArticle = (text, source) => {
    // Add the transcription to the article content as a quote
    const quote = `> "${text}" - ${source}\n\n`;
    setArticleContent(prev => prev + quote);
    
    toast({
      title: "Citação adicionada",
      description: "A citação foi inserida no final do artigo"
    });
  };

  const renderLineNumbers = (content) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    return (
      <div className="absolute left-0 top-0 pt-4 pr-2 pb-4 text-right text-xs text-muted-foreground select-none w-[30px]">
        {lines.map((_, i) => (
          <div key={i} className="h-6">{i + 1}</div>
        ))}
      </div>
    );
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
                  className={`px-6 py-2 h-auto ${workflowState.articleType === type.id ? 'bg-primary/10 border-primary' : ''}`}
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
                  {editingTitle === title ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        className="flex-1 p-2 border rounded"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEditedTitle()}
                        autoFocus
                      />
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditTitle}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveEditedTitle}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{title}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTitle(title)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSelectTitle(title)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Selecionar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleEditTitle("Novo título personalizado")}
              >
                <Plus className="h-4 w-4" />
                Adicionar novo título
              </Button>
            </div>
          </div>
        );
        
      case "content-editing":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selectedTitle}</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={handleToggleLineNumbers}
                >
                  <ListOrdered className="h-4 w-4" />
                  {showLineNumbers ? "Ocultar linhas" : "Mostrar linhas"}
                </Button>
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
            </div>
            
            <div className="relative">
              {showLineNumbers && !editMode && renderLineNumbers(articleContent)}
              
              {editMode ? (
                <textarea
                  className="w-full min-h-[500px] p-4 pl-10 border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  value={articleContent}
                  onChange={handleContentChange}
                />
              ) : (
                <div 
                  ref={articleRef}
                  className="prose prose-slate max-w-none dark:prose-invert p-4 pl-10 border rounded-md min-h-[500px] bg-background relative"
                  onClick={handleToggleEditMode}
                >
                  <div dangerouslySetInnerHTML={{ 
                    __html: articleContent
                      .replace(/^# (.*$)/gm, '<h1 id="title">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 id="$1">$2</h2>')
                      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n- (.*$)/gm, '<ul><li>$1</li></ul>')
                      .replace(/> "(.*)" - (.*)/g, '<blockquote class="border-l-4 border-primary pl-4 italic">$1<footer class="text-sm text-muted-foreground">— $2</footer></blockquote>')
                  }} />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft} 
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Salvando..." : "Guardar como rascunho"}
              </Button>
              <Button onClick={handleApproveForPublication} className="gap-2">
                <Send className="h-4 w-4" />
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

            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => onWorkflowUpdate({ step: "content-editing" })}
              >
                <Edit className="h-4 w-4" />
                Voltar para edição
              </Button>
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

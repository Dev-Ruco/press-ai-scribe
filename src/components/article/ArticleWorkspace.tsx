import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, Edit, Save, Send, X, 
  Plus, FileText, Copy, ListOrdered,
  Pencil, Eye, MoveRight, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cleanMarkers } from "@/lib/textUtils";
import { ArticleEditor } from "./editor/ArticleEditor";
import { ArticlePreview } from "./editor/ArticlePreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileEdit } from "lucide-react";

// Article type options for selection
const ARTICLE_TYPES = [
  { id: "news", label: "Notícia", structure: ["Título", "Lead", "Corpo", "Conclusão"] },
  { id: "report", label: "Reportagem", structure: ["Título", "Lead", "Contexto", "Desenvolvimento", "Fontes", "Conclusão"] },
  { id: "opinion", label: "Opinião", structure: ["Título", "Tese", "Argumentação", "Conclusão"] },
  { id: "chronicle", label: "Crónica", structure: ["Título", "Abertura", "Desenvolvimento", "Desfecho"] },
  { id: "press-release", label: "Comunicado", structure: ["Título", "Declaração", "Detalhes", "Contatos"] },
  { id: "editorial", label: "Editorial", structure: ["Título", "Posicionamento", "Fundamentação", "Conclusão"] },
  { id: "event-report", label: "Relatório de Evento", structure: ["Título", "Resumo", "Participantes", "Principais Pontos", "Conclusões"] }
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
  const [selectedTab, setSelectedTab] = useState("edit");
  const articleRef = useRef(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get the selected article type object
  const selectedArticleType = ARTICLE_TYPES.find(type => type.id === workflowState.articleType) || ARTICLE_TYPES[0];

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
  }, [workflowState.step, workflowState.isProcessing, onWorkflowUpdate, toast]);

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
      // Generate sample content based on the selected article type and title
      const articleType = selectedArticleType || ARTICLE_TYPES[0];
      const sampleContent = generateStructuredContent(title, articleType);
      
      setArticleContent(sampleContent);
      onWorkflowUpdate({ isProcessing: false });
    }, 2000);
  };

  // Function to generate structured content based on article type
  const generateStructuredContent = (title, articleType) => {
    const leadText = SAMPLE_LEADS[0].text;
    let content = `# ${title}\n\n${leadText}\n\n`;
    
    // Add structure based on article type
    if (articleType.id === "news") {
      content += `## Contexto Atual\n\nMoçambique enfrenta desafios significativos no setor energético, com apenas 34% da população tendo acesso à eletricidade. As disparidades entre áreas urbanas (65%) e rurais (22%) destacam a necessidade de soluções inovadoras.\n\n## Principais Desenvolvimentos\n\nO ano de 2023 marcou um avanço significativo, com o aumento de 45% nos investimentos em energia renovável. Projetos de destaque incluem:\n\n- Parque solar de Mocuba, com capacidade de 40MW\n- Iniciativas de microgeração em comunidades isoladas\n- Projetos piloto de energia eólica na região costeira\n\n## Perspectivas Futuras\n\nEspecialistas preveem que, mantido o ritmo atual de investimentos, Moçambique poderá atingir 60% de energia renovável em sua matriz até 2030, posicionando o país como líder regional em sustentabilidade energética.`;
    } else if (articleType.id === "report") {
      content += `## Contexto Histórico\n\nA questão energética em Moçambique tem raízes históricas que remontam ao período colonial, quando o acesso à eletricidade era limitado às áreas urbanas e centros administrativos.\n\n## Situação Atual\n\nMoçambique enfrenta um paradoxo energético significativo. Apesar de ser um exportador de energia para países vizinhos através da barragem de Cahora Bassa, apenas 34% de sua população tem acesso à eletricidade.\n\n## Testemunhos\n\n> "Nossa comunidade mudou completamente desde a instalação dos painéis solares. As crianças podem estudar à noite e nosso posto de saúde agora funciona 24 horas." - Líder comunitário de Nampula\n\n## Análise de Especialistas\n\nSegundo Maria Fernanda Almeida, especialista em energia renovável do Banco Mundial, "Moçambique tem potencial para liderar a transformação energética da África Austral, mas precisa resolver os gargalos de distribuição e financiamento".\n\n## Conclusão\n\nA transformação energética de Moçambique representa não apenas uma oportunidade econômica, mas também um caminho para o desenvolvimento sustentável e inclusivo do país.`;
    } else if (articleType.id === "opinion") {
      content += `## Tese\n\nA transição energética de Moçambique precisa ser vista como um projeto de Estado, acima de mudanças governamentais e interesses partidários.\n\n## Argumentação\n\nA história recente de Moçambique demonstra como projetos energéticos importantes frequentemente sofrem interrupções ou alterações significativas a cada ciclo eleitoral. Este padrão prejudica não apenas o desenvolvimento da infraestrutura, mas também a confiança de investidores internacionais.\n\nOs exemplos de países como Marrocos e Quênia, que estabeleceram planos energéticos de longo prazo com comprometimento multipartidário, mostram que é possível transcender a polarização política quando o objetivo é o desenvolvimento nacional.\n\n## Contraponto\n\nAlguns argumentam que cada governo deve ter autonomia para definir suas prioridades energéticas. No entanto, essa abordagem tem mostrado resultados limitados em um setor que requer décadas de investimento contínuo.\n\n## Conclusão\n\nPara que Moçambique realize seu potencial energético, é necessário um pacto nacional que estabeleça diretrizes claras e compromissos de longo prazo, independentemente de quem ocupe o poder.`;
    } else {
      // Default structure for other article types
      content += `## Introdução\n\nEste é um artigo do tipo ${articleType.label} sobre ${title}.\n\n## Desenvolvimento\n\nAqui vem o corpo principal do artigo com informações detalhadas sobre o tema.\n\n## Conclusão\n\nConsiderações finais e próximos passos relacionados ao tema abordado.`;
    }
    
    return cleanMarkers(content);
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

  const handleContentChange = (newContent) => {
    setArticleContent(newContent);
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
    onWorkflowUpdate({ step: "image-selection" }); // Changed from "finalization" to "image-selection"
    toast({
      title: "Conteúdo aprovado",
      description: "Agora você pode selecionar imagens para seu artigo."
    });
  };

  const handleSendForReview = () => {
    toast({
      title: "Enviado para revisão",
      description: "Seu artigo foi enviado para revisão editorial."
    });
  };

  const handleRegenerate = () => {
    onWorkflowUpdate({ step: "title-selection" });
    toast({
      title: "Gerando novo conteúdo",
      description: "Gerando novo conteúdo para o artigo."
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
            {/* Article Type Header */}
            <div className="flex items-center bg-muted/40 p-3 rounded-lg border">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-muted-foreground">TIPO DE ARTIGO</h2>
                <p className="font-playfair text-xl">{selectedArticleType.label}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-sm text-muted-foreground">Estrutura recomendada:</div>
                <div className="flex gap-2 items-center mt-1">
                  {selectedArticleType.structure.map((section, i) => (
                    <div key={i} className="flex items-center">
                      {i > 0 && <MoveRight className="h-3 w-3 mx-1 text-muted-foreground/50" />}
                      <span className="text-xs px-2 py-0.5 bg-primary/10 rounded-full">{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Editor Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
              <div className="flex justify-between items-center border-b mb-2">
                <TabsList className="h-10">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    <span>Editar</span>
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>Pré-visualizar</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className="text-xs py-1 px-2 h-8"
                  >
                    <ListOrdered className="h-4 w-4 mr-1" />
                    {showLineNumbers ? "Ocultar linhas" : "Mostrar linhas"}
                  </Button>
                </div>
              </div>
              
              <TabsContent value="edit">
                <ArticleEditor 
                  content={articleContent}
                  onChange={handleContentChange}
                  showLineNumbers={showLineNumbers}
                  articleType={selectedArticleType}
                />
              </TabsContent>
              
              <TabsContent value="preview">
                <ArticlePreview 
                  content={articleContent}
                  articleType={selectedArticleType}
                />
              </TabsContent>
            </Tabs>
            
            {/* Action buttons */}
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Seção
                </Button>
              </div>
              <Button 
                size="sm"
                onClick={() => onWorkflowUpdate({ step: "image-selection" })}
              >
                Avançar para Imagens
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

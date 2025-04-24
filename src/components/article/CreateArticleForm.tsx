
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Link2, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  Edit, 
  Image, 
  Check, 
  RefreshCw, 
  Plus, 
  Globe,
  Calendar,
  Tag,
  Save,
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArticleImageSection } from "./image/ArticleImageSection";

const mockTitles = [
  "Como as energias renováveis estão transformando o setor elétrico em Moçambique",
  "Energia limpa: O futuro sustentável de Moçambique enfrenta desafios",
  "A revolução energética silenciosa que está ocorrendo no norte de Moçambique",
  "Entre tradição e inovação: O dilema energético moçambicano",
  "Da crise à oportunidade: Moçambique aposta em energia renovável"
];

const mockLeads = [
  "Um relatório divulgado esta semana revela que os investimentos em energia solar e eólica em Moçambique cresceram 45% no último ano, sinalizando uma transformação sem precedentes no setor energético do país.",
  "Enfrentando desafios de distribuição e infraestrutura, Moçambique dá passos ambiciosos rumo à independência energética com projetos inovadores de energia limpa nas províncias do norte.",
  "Combinando práticas tradicionais com tecnologias de ponta, comunidades rurais moçambicanas estão liderando uma revolução silenciosa que pode redefinir o futuro energético do país."
];

const mockSources = [
  {
    title: "Entrevista com Ministro de Energia",
    excerpt: "\"Nosso objetivo é alcançar 60% de energia renovável na matriz energética até 2030\", afirmou o ministro durante coletiva de imprensa.",
    type: "Entrevista",
    time: "13:45"
  },
  {
    title: "Relatório Anual do Setor Energético",
    excerpt: "O documento indica crescimento de 45% nos investimentos em energia renovável, com destaque para projetos solares.",
    type: "Documento",
    time: "Pág. 23"
  },
  {
    title: "Dados da Agência Nacional de Energia",
    excerpt: "Estatísticas mostram que 37% das comunidades rurais ainda não têm acesso à eletricidade.",
    type: "Estatística",
    time: "Tab. 4.2"
  }
];

const mockDraftContent = `
# A transformação energética de Moçambique

Moçambique está passando por uma transformação significativa no seu setor energético, com investimentos crescentes em fontes renováveis que prometem revolucionar a matriz energética do país nos próximos anos.

## O cenário atual

Atualmente, apenas 34% da população moçambicana tem acesso à eletricidade, com disparidades significativas entre áreas urbanas (65%) e rurais (22%). Esta realidade tem impulsionado o governo a buscar soluções inovadoras e sustentáveis.

## Investimentos e projetos

O ano de 2023 marcou um avanço significativo, com o aumento de 45% nos investimentos em energia renovável. Projetos de destaque incluem:

- Parque solar de Mocuba, com capacidade de 40MW
- Iniciativas de microgeração em comunidades isoladas
- Projetos piloto de energia eólica na região costeira

## Desafios persistentes

Apesar dos avanços, persistem desafios importantes:

1. Infraestrutura de distribuição deficiente
2. Capacitação técnica insuficiente
3. Financiamento limitado para projetos de grande escala

## Perspectivas futuras

Especialistas preveem que, mantido o ritmo atual de investimentos, Moçambique poderá atingir 60% de energia renovável em sua matriz até 2030, posicionando o país como líder regional em sustentabilidade energética.
`;

const mockImages = [
  {
    url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80",
    caption: "Painéis solares instalados em comunidade rural de Nampula",
    source: "Gerado por IA"
  },
  {
    url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
    caption: "Técnicos locais recebem treinamento para manutenção de equipamentos solares",
    source: "Banco de imagens"
  },
  {
    url: "https://images.unsplash.com/photo-1454779132693-e5cd0a216ed3?w=400&q=80",
    caption: "Construção do parque solar de Mocuba, um dos maiores projetos de energia renovável do país",
    source: "Pesquisa Web"
  }
];

export function CreateArticleForm() {
  const [step, setStep] = useState(1);
  const [substep, setSubstep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLead, setSelectedLead] = useState("");
  const [selectedImage, setSelectedImage] = useState<typeof mockImages[0] | null>({
    url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80",
    caption: "Painéis solares instalados em comunidade rural de Nampula",
    source: "Gerado por IA"
  });
  const [articleStatus, setArticleStatus] = useState<"draft" | "pending" | "approved" | "published">("draft");
  
  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      setSubstep(1);
      setProgress((step / 6) * 100);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setSubstep(1);
      setProgress(((step - 2) / 6) * 100);
    }
  };

  const handleNextSubstep = () => {
    // Get max substep based on current step
    const maxSubstep = step === 2 ? 4 : 1;
    if (substep < maxSubstep) {
      setSubstep(substep + 1);
    } else {
      handleNextStep();
    }
  };

  const handlePrevSubstep = () => {
    if (substep > 1) {
      setSubstep(substep - 1);
    } else {
      handlePrevStep();
    }
  };

  const handleSelectTitle = (title: string) => {
    setSelectedTitle(title);
    handleNextSubstep();
  };

  const handleSelectLead = (lead: string) => {
    setSelectedLead(lead);
    handleNextSubstep();
  };

  const handleSelectImage = (image: typeof mockImages[0]) => {
    setSelectedImage(image);
  };

  const handlePublish = () => {
    setArticleStatus("published");
    // Additional logic for publishing would go here
  };

  const handleSaveDraft = () => {
    // Logic for saving as draft would go here
    alert("Artigo salvo como rascunho");
  };

  const handleSubmitForApproval = () => {
    setArticleStatus("pending");
    // Additional logic for submission would go here
    alert("Artigo enviado para aprovação editorial");
  };

  const handleImageSelect = (imageUrl: string) => {
    // Handle the selected image
    setSelectedImage({ url: imageUrl, caption: "", source: "AI Generated" });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Upload de Arquivo</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
                  <p className="text-sm text-text-secondary">
                    Arraste arquivos ou clique para fazer upload
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Suporta áudio, vídeo, texto ou PDF
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Link</label>
                <div className="relative">
                  <Input
                    placeholder="Cole o link do YouTube, TikTok, etc."
                    className="pl-10"
                  />
                  <Link2 className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Conteúdo</label>
                <Textarea
                  placeholder="Digite ou cole o conteúdo aqui"
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Tipo de Artigo
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">Notícia</SelectItem>
                      <SelectItem value="opinion">Op-Ed</SelectItem>
                      <SelectItem value="interview">Entrevista</SelectItem>
                      <SelectItem value="chronicle">Crônica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Idioma
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-mz">Português (Moçambique)</SelectItem>
                      <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                      <SelectItem value="en">Inglês</SelectItem>
                      <SelectItem value="fr">Francês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Padrão Ortográfico
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o padrão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre1990">Pré-1990</SelectItem>
                      <SelectItem value="post1990">Pós-1990</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Tom do Artigo
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutro</SelectItem>
                      <SelectItem value="analytical">Analítico</SelectItem>
                      <SelectItem value="creative">Criativo</SelectItem>
                      <SelectItem value="journalistic">Jornalístico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Destino Editorial
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Portal Principal</SelectItem>
                      <SelectItem value="business">Seção Economia</SelectItem>
                      <SelectItem value="culture">Seção Cultura</SelectItem>
                      <SelectItem value="tech">Seção Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        switch (substep) {
          case 1:
            return (
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
                  <h3 className="text-lg font-medium">Sugestões de Título</h3>
                  <p className="text-text-secondary text-sm">Selecione uma das opções ou edite para criar seu próprio título</p>
                </div>
                
                <div className="space-y-4">
                  {mockTitles.map((title, index) => (
                    <div key={index} className="border rounded-md p-4 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-base font-medium flex-1">{title}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" onClick={() => handleSelectTitle(title)}>
                            <Check className="h-4 w-4 mr-1" />
                            Usar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Dica do Assistente</h4>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">
                    Títulos entre 50-60 caracteres têm melhor desempenho em SEO. 
                    Inclua palavras-chave relevantes para ampliar o alcance.
                  </p>
                </div>
              </div>
            );
          case 2:
            return (
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
                  <h3 className="text-lg font-medium">Sugestões de Lead</h3>
                  <p className="text-text-secondary text-sm">Escolha um lead para seu artigo ou edite para criar seu próprio</p>
                </div>
                
                {selectedTitle && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-medium">Título selecionado:</p>
                    <p className="text-text-secondary">{selectedTitle}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {mockLeads.map((lead, index) => (
                    <div key={index} className="border rounded-md p-4 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-base">{lead}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" onClick={() => handleSelectLead(lead)}>
                            <Check className="h-4 w-4 mr-1" />
                            Usar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Dica do Assistente</h4>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">
                    Um bom lead captura a essência da história nos primeiros 40-50 palavras.
                    Responda às perguntas básicas: o quê, quem, quando, onde, por quê.
                  </p>
                </div>
              </div>
            );
          case 3:
            return (
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
                  <h3 className="text-lg font-medium">Transcrições de Fontes</h3>
                  <p className="text-text-secondary text-sm">Citações e dados identificados no conteúdo enviado</p>
                </div>
                
                <div className="space-y-4">
                  {mockSources.map((source, index) => (
                    <div key={index} className="border rounded-md">
                      <div className="flex justify-between items-center p-3 bg-bg-gray border-b">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{source.type}</Badge>
                          <h4 className="font-medium">{source.title}</h4>
                        </div>
                        <div className="text-xs text-text-secondary flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {source.time}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-text-secondary text-sm">{source.excerpt}</p>
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">Ver Completo</Button>
                          <Button size="sm">Usar Trecho</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Fonte Manualmente
                </Button>
              </div>
            );
          case 4:
            return (
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
                  <h3 className="text-lg font-medium">Informações Complementares</h3>
                  <p className="text-text-secondary text-sm">Dados contextuais que podem enriquecer seu artigo</p>
                </div>
                
                <div className="mb-4">
                  <Input type="search" placeholder="Buscar informações relacionadas..." />
                </div>
                
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Badge className="mr-2">Estatísticas</Badge>
                          Dados sobre o setor energético (2023)
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-text-secondary">
                          <li>34% da população tem acesso à eletricidade</li>
                          <li>65% de acesso em áreas urbanas vs. 22% em áreas rurais</li>
                          <li>Crescimento de 45% em investimentos em energia renovável</li>
                          <li>Meta de 60% de energia renovável na matriz até 2030</li>
                        </ul>
                        <div className="mt-4 flex justify-end">
                          <Button size="sm">Adicionar ao Artigo</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Badge className="mr-2" variant="outline">Contexto</Badge>
                          Histórico de projetos energéticos em Moçambique
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-text-secondary">
                          Nos últimos 5 anos, Moçambique implementou diversos projetos de energia renovável,
                          com destaque para o parque solar de Mocuba inaugurado em 2019, com capacidade de 40MW.
                          O projeto, financiado pelo Banco Mundial, foi o primeiro de grande escala no país.
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button size="sm">Adicionar ao Artigo</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <Badge className="mr-2" variant="secondary">Notícia Relacionada</Badge>
                          Novos investimentos anunciados essa semana
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-text-secondary">
                          O Ministério da Energia anunciou ontem novos investimentos de €120 milhões
                          para expansão da rede elétrica em áreas rurais, com foco em soluções off-grid baseadas em energia solar.
                          O projeto beneficiará cerca de 150 mil pessoas em 200 comunidades.
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button size="sm">Adicionar ao Artigo</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            );
          default:
            return null;
        }
      case 3:
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
              <h3 className="text-lg font-medium">Escrita Assistida por IA</h3>
              <p className="text-text-secondary text-sm">Edite o rascunho gerado e aprimore o conteúdo</p>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{selectedTitle || "A transformação energética de Moçambique"}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerar
                </Button>
                <Select defaultValue="neutral">
                  <SelectTrigger className="w-[130px] h-9 text-xs">
                    <SelectValue placeholder="Tom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Tom Neutro</SelectItem>
                    <SelectItem value="formal">Tom Formal</SelectItem>
                    <SelectItem value="simple">Tom Simplificado</SelectItem>
                    <SelectItem value="journalistic">Tom Jornalístico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                {/* Using pre for formatting, but in a real app this would be a rich text editor */}
                <pre style={{
                  fontFamily: 'inherit', 
                  whiteSpace: 'pre-wrap', 
                  margin: 0
                }}>
                  {mockDraftContent}
                </pre>
              </div>
            </ScrollArea>
            
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Seção
                </Button>
              </div>
              <Button size="sm">
                Salvar Alterações
              </Button>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Ferramentas de Edição</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-5">
                <Button variant="outline" size="sm">Refinar</Button>
                <Button variant="outline" size="sm">Expandir</Button>
                <Button variant="outline" size="sm">Encurtar</Button>
                <Button variant="outline" size="sm">Citar</Button>
                <Button variant="outline" size="sm">Neutralizar</Button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <ArticleImageSection 
              onImageSelect={handleImageSelect} 
              articleContent={mockDraftContent} 
              articleTitle={selectedTitle || "A transformação energética de Moçambique"}
            />
            
            {selectedImage && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Editar Legenda</h4>
                <Textarea 
                  value={selectedImage.caption}
                  onChange={(e) => setSelectedImage({
                    ...selectedImage,
                    caption: e.target.value
                  })}
                  className="mb-3" 
                  placeholder="Digite uma legenda para a imagem..."
                />
                <div className="flex justify-end">
                  <Button size="sm">Confirmar Imagem</Button>
                </div>
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
              <h3 className="text-lg font-medium">Revisão Editorial</h3>
              <p className="text-text-secondary text-sm">Verifique a qualidade e solicite colaboração</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Status do Artigo</h4>
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  className={`
                    ${articleStatus === 'draft' ? 'bg-muted text-muted-foreground' : ''} 
                    ${articleStatus === 'pending' ? 'bg-amber-500' : ''} 
                    ${articleStatus === 'approved' ? 'bg-emerald-500' : ''} 
                    ${articleStatus === 'published' ? 'bg-primary' : ''} 
                  `}
                >
                  {articleStatus === 'draft' && 'Rascunho'}
                  {articleStatus === 'pending' && 'Aguardando Aprovação'}
                  {articleStatus === 'approved' && 'Aprovado'}
                  {articleStatus === 'published' && 'Publicado'}
                </Badge>
                <span className="text-xs text-text-secondary">
                  Última atualização: 19 Abr, 2025 - 14:30
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox id="sources" checked={true} />
                    <label htmlFor="sources" className="text-sm font-medium cursor-pointer">
                      Fontes verificadas
                    </label>
                  </div>
                  <Badge variant="outline" className="text-emerald-500">✓</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox id="tone" checked={true} />
                    <label htmlFor="tone" className="text-sm font-medium cursor-pointer">
                      Tom editorial apropriado
                    </label>
                  </div>
                  <Badge variant="outline" className="text-emerald-500">✓</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox id="format" checked={false} />
                    <label htmlFor="format" className="text-sm font-medium cursor-pointer">
                      Formatação completa
                    </label>
                  </div>
                  <Badge variant="outline" className="text-amber-500">!</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Checkbox id="images" checked={selectedImage !== null} />
                    <label htmlFor="images" className="text-sm font-medium cursor-pointer">
                      Imagens selecionadas
                    </label>
                  </div>
                  {selectedImage ? 
                    <Badge variant="outline" className="text-emerald-500">✓</Badge> : 
                    <Badge variant="outline" className="text-amber-500">!</Badge>
                  }
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-3">Atribuir Tarefas</h4>
              
              <div className="space-y-3">
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">Revisão de formatação</p>
                    <Select defaultValue="marcos">
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Atribuir para" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marcos">Marcos Silva</SelectItem>
                        <SelectItem value="ana">Ana Costa</SelectItem>
                        <SelectItem value="joao">João Pereira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Verificar formatação de parágrafos e cabeçalhos</p>
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">Verificação factual</p>
                    <Select>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Atribuir para" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marcos">Marcos Silva</SelectItem>
                        <SelectItem value="ana">Ana Costa</SelectItem>
                        <SelectItem value="joao">João Pereira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Conferir dados estatísticos e declarações</p>
                </div>
                
                <div className="border rounded p-3">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">Título e meta descrição</p>
                    <Select>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Atribuir para" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marcos">Marcos Silva</SelectItem>
                        <SelectItem value="ana">Ana Costa</SelectItem>
                        <SelectItem value="joao">João Pereira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Otimizar para SEO</p>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nova Tarefa
              </Button>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Adicionar Comentário
              </Button>
              <Button 
                variant={articleStatus === 'pending' ? 'outline' : 'default'} 
                className="flex-1"
                onClick={handleSubmitForApproval}
                disabled={articleStatus === 'pending'}
              >
                {articleStatus === 'pending' ? 'Enviado para Aprovação' : 'Enviar para Aprovação'}
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
              <h3 className="text-lg font-medium">Publicação</h3>
              <p className="text-text-secondary text-sm">Configure e publique seu artigo em múltiplos canais</p>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-base mb-3">Configurações de Publicação</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Data de Publicação
                    </label>
                    <Input type="datetime-local" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Visibilidade
                    </label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a visibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="members">Assinantes</SelectItem>
                        <SelectItem value="private">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Categorias
                    </label>
                    <Input placeholder="Energia, Sustentabilidade, Moçambique" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      URL personalizada
                    </label>
                    <Input placeholder="energia-renovavel-mocambique" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Meta descrição (SEO)
                  </label>
                  <Textarea 
                    placeholder="Uma breve descrição para mecanismos de busca (150-160 caracteres)" 
                    maxLength={160}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium text-base mb-3">Canais de Distribuição</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="website" checked={true} />
                    <label htmlFor="website" className="text-sm font-medium cursor-pointer">
                      Website principal
                    </label>
                  </div>
                  <Badge className="bg-emerald-500">Pronto</Badge>
                </div>
                
                <div className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="facebook" />
                    <label htmlFor="facebook" className="text-sm font-medium cursor-pointer">
                      Facebook
                    </label>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="twitter" />
                    <label htmlFor="twitter" className="text-sm font-medium cursor-pointer">
                      X (Twitter)
                    </label>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="newsletter" />
                    <label htmlFor="newsletter" className="text-sm font-medium cursor-pointer">
                      Newsletter por e-mail
                    </label>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h4 className="font-medium text-base">Verificação Final</h4>
              </div>
              
              <div className="space-y-3 pl-7">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SEO Meta Tags</span>
                  <Badge variant="outline" className="text-amber-500">Pendente</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Imagens Otimizadas</span>
                  <Badge variant="outline" className="text-emerald-500">✓</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Permissões para Ativos</span>
                  <Badge variant="outline" className="text-emerald-500">✓</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Análise de Conteúdo</span>
                  <Badge variant="outline" className="text-emerald-500">✓</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Rascunho
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Salvar como rascunho?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O artigo será salvo como rascunho e poderá ser editado posteriormente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveDraft}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1">
                    Publicar Agora
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar publicação?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O artigo será publicado imediatamente e estará visível para seus leitores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish}>Confirmar Publicação</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-medium tracking-tight">Criar Novo Artigo</h3>
            <p className="text-sm text-text-secondary">Preencha os dados abaixo para criar seu artigo</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-sm text-text-secondary mr-2">{progress}%</span>
              <Progress value={progress} className="w-[100px]" />
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={step === 2 && substep > 1 ? handlePrevSubstep : handlePrevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {step === 2 && substep > 1 ? "Voltar" : "Etapa Anterior"}
          </Button>
        ) : (
          <div /> // Empty div for spacing
        )}
        
        {step < 6 ? (
          <Button onClick={step === 2 && substep < 4 ? handleNextSubstep : handleNextStep}>
            {step === 2 && substep < 4 ? "Próximo" : "Próxima Etapa"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <div /> // Empty div for spacing when on the last step
        )}
      </div>
    </div>
  );
}

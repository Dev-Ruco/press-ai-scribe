
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Image as ImageIcon, 
  Search, 
  Upload, 
  Sparkles,
  RefreshCw,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArticleImageSectionProps {
  onImageSelect: (imageUrl: string) => void;
  articleContent?: string;
  articleTitle?: string;
}

export function ArticleImageSection({ 
  onImageSelect, 
  articleContent = "", 
  articleTitle = ""
}: ArticleImageSectionProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();
  
  // Image options for each category
  const [aiGeneratedImages, setAiGeneratedImages] = useState<{url: string, title: string}[]>([]);
  const [databaseImages, setDatabaseImages] = useState<{url: string, title: string, category: string}[]>([]);
  const [webImages, setWebImages] = useState<{url: string, title: string}[]>([]);
  
  // Extract keywords from article content or title for search
  const extractKeywords = () => {
    const content = articleContent || articleTitle;
    if (!content) return "";
    
    // Simple keyword extraction (in a real app, use NLP)
    const words = content.split(/\s+/).filter(word => 
      word.length > 4 && 
      !["sobre", "entre", "quando", "ainda", "porque", "também"].includes(word.toLowerCase())
    );
    
    // Take the first 3 meaningful words
    return words.slice(0, 3).join(", ");
  };
  
  useEffect(() => {
    // Automatically set prompt based on article content
    if (articleContent || articleTitle) {
      const suggestedPrompt = extractKeywords();
      setAiPrompt(suggestedPrompt);
      setSearchQuery(suggestedPrompt);
    }
    
    // Fetch database images as soon as component mounts
    fetchDatabaseImages();
  }, [articleContent, articleTitle]);
  
  // Mock function to fetch database images (in a real app, call your actual API)
  const fetchDatabaseImages = () => {
    // Simulated database images
    const mockDatabaseImages = [
      {
        url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80",
        title: "Tecnologia e Inovação",
        category: "tech"
      },
      {
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
        title: "Desenvolvimento Web",
        category: "code"
      },
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
        title: "Trabalho Remoto",
        category: "work"
      }
    ];
    setDatabaseImages(mockDatabaseImages);
  };
  
  // Generate AI images based on prompt
  const handleGenerateImage = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, integrate with AI image generation API
      // Here we're using mock data
      setTimeout(() => {
        const mockGeneratedImages = [
          { 
            url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", 
            title: "Imagem gerada 1" 
          },
          { 
            url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", 
            title: "Imagem gerada 2" 
          },
          { 
            url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
            title: "Imagem gerada 3" 
          }
        ];
        
        setAiGeneratedImages(mockGeneratedImages);
        setIsGenerating(false);
        setHasGenerated(true);
        
        toast({
          title: "Imagens geradas",
          description: "Três opções de imagens geradas pela IA"
        });
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar as imagens"
      });
    }
  };
  
  // Search for web images
  const handleSearchImages = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      // In a real app, integrate with image search API
      // Here we're using mock data
      const mockWebImages = [
        { 
          url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80", 
          title: "Resultado web 1" 
        },
        { 
          url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", 
          title: "Resultado web 2" 
        },
        { 
          url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", 
          title: "Resultado web 3" 
        }
      ];
      
      setWebImages(mockWebImages);
      
      toast({
        title: "Busca concluída",
        description: "Resultados encontrados para " + searchQuery
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na busca",
        description: "Não foi possível buscar imagens"
      });
    }
  };
  
  // Render 3 images for a category
  const renderImageOptions = (images, label) => {
    if (images.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          {label === "IA" && !hasGenerated 
            ? "Clique em 'Gerar com IA' para criar imagens" 
            : label === "Web" 
              ? "Busque imagens para ver os resultados" 
              : "Nenhuma imagem disponível"}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.slice(0, 3).map((image, index) => (
          <div 
            key={index}
            className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors group relative"
            onClick={() => onImageSelect(image.url)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Check className="text-white h-10 w-10 drop-shadow-md" />
            </div>
            <img 
              src={image.url} 
              alt={image.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <p className="text-sm font-medium truncate">{image.title}</p>
              {image.category && (
                <p className="text-xs text-text-secondary">{image.category}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Imagens para o Artigo</h3>
        <p className="text-text-secondary text-sm">
          Escolha entre imagens geradas por IA, banco de imagens ou busca online
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList className="gap-2">
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Banco de Imagens
          </TabsTrigger>
          <TabsTrigger value="web" className="gap-2">
            <Search className="h-4 w-4" />
            Web
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Descreva a imagem que você deseja gerar..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button 
                onClick={handleGenerateImage} 
                disabled={!aiPrompt || isGenerating}
                className="gap-2 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : hasGenerated ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerar
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Sugestão baseada no seu artigo: {extractKeywords() || "Escreva mais conteúdo"}
            </p>
          </div>
          
          {renderImageOptions(aiGeneratedImages, "IA")}
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          {renderImageOptions(databaseImages, "Banco")}
        </TabsContent>

        <TabsContent value="web" className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar imagens na web..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                onClick={handleSearchImages} 
                disabled={!searchQuery}
                className="gap-2 whitespace-nowrap"
              >
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
          
          {renderImageOptions(webImages, "Web")}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-text-secondary" />
            <p className="text-sm text-text-secondary">
              Arraste uma imagem ou clique para fazer upload
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Suporta JPG, PNG ou WebP até 5MB
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

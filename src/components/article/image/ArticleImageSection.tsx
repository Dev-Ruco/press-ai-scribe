
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Upload, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArticleImageSectionProps {
  onImageSelect: (imageUrl: string) => void;
  articleContent: string;
  articleTitle: string;
}

export function ArticleImageSection({ 
  onImageSelect, 
  articleContent = "", 
  articleTitle = ""
}: ArticleImageSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiGeneratedImages, setAiGeneratedImages] = useState<{url: string, title: string}[]>([]);
  const [databaseImages, setDatabaseImages] = useState<{url: string, title: string, category: string}[]>([]);
  const [webImages, setWebImages] = useState<{url: string, title: string}[]>([]);
  const { toast } = useToast();
  
  // Extrair palavras-chave do conteúdo do artigo
  const extractKeywords = () => {
    const content = articleContent || articleTitle;
    if (!content) return "";
    
    const words = content.split(/\s+/).filter(word => 
      word.length > 4 && 
      !["sobre", "entre", "quando", "ainda", "porque", "também"].includes(word.toLowerCase())
    );
    
    return words.slice(0, 3).join(", ");
  };

  useEffect(() => {
    if (articleContent || articleTitle) {
      loadAllImageSuggestions();
    }
  }, [articleContent, articleTitle]);

  const loadAllImageSuggestions = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        generateAIImages(),
        fetchDatabaseImages(),
        searchWebImages()
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar imagens",
        description: "Não foi possível carregar algumas sugestões de imagens"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIImages = async () => {
    // Simulated AI image generation (replace with actual API call)
    const mockAIImages = [
      { url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", title: "AI Gerada 1" },
      { url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", title: "AI Gerada 2" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80", title: "AI Gerada 3" }
    ];
    setAiGeneratedImages(mockAIImages);
  };

  const fetchDatabaseImages = async () => {
    // Simulated database fetch (replace with actual database query)
    const mockDatabaseImages = [
      { url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", title: "Do Banco 1", category: "tech" },
      { url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", title: "Do Banco 2", category: "code" },
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80", title: "Do Banco 3", category: "work" }
    ];
    setDatabaseImages(mockDatabaseImages);
  };

  const searchWebImages = async () => {
    // Simulated web search (replace with actual API call)
    const mockWebImages = [
      { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80", title: "Web 1" },
      { url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80", title: "Web 2" },
      { url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", title: "Web 3" }
    ];
    setWebImages(mockWebImages);
  };

  const renderImageGrid = (images: any[], label: string) => {
    if (images.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 border-2 border-t-transparent border-primary rounded-full animate-spin" />
              <p>Buscando imagens...</p>
            </div>
          ) : (
            "Nenhuma imagem encontrada"
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
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
                <p className="text-xs text-muted-foreground">{image.category}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-muted/50">
        <h3 className="text-lg font-medium">Imagens Sugeridas para o Artigo</h3>
        <p className="text-sm text-muted-foreground">
          Sugestões baseadas no conteúdo: {extractKeywords()}
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList className="gap-2">
          <TabsTrigger value="ai" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Banco de Imagens
          </TabsTrigger>
          <TabsTrigger value="web" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Web
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          {renderImageGrid(aiGeneratedImages, "IA")}
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={generateAIImages} 
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Gerar Novas Imagens
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="database">
          {renderImageGrid(databaseImages, "Banco")}
        </TabsContent>

        <TabsContent value="web">
          {renderImageGrid(webImages, "Web")}
        </TabsContent>

        <TabsContent value="upload">
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste uma imagem ou clique para fazer upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Suporta JPG, PNG ou WebP até 5MB
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

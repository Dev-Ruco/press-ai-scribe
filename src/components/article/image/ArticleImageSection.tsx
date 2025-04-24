
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Search, Upload, Sparkles } from "lucide-react";

interface ArticleImageSectionProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ArticleImageSection({ onImageSelect }: ArticleImageSectionProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for database images (in a real app, this would come from your backend)
  const databaseImages = [
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

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    // Here you would integrate with an AI image generation service
    setTimeout(() => {
      setIsGenerating(false);
      // Mock response
      onImageSelect("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80");
    }, 2000);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Imagens para o Artigo</h3>
        <p className="text-text-secondary text-sm">
          Gere imagens com IA ou escolha do nosso banco de imagens
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            IA
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Image className="h-4 w-4" />
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
            <Input
              placeholder="Descreva a imagem que você deseja gerar..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button 
              onClick={handleGenerateImage} 
              disabled={!aiPrompt || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Gerando imagem...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar com IA
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {databaseImages.map((image, index) => (
              <div 
                key={index}
                className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => onImageSelect(image.url)}
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{image.title}</p>
                  <p className="text-xs text-text-secondary">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="web" className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Buscar imagens na web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="w-full gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
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

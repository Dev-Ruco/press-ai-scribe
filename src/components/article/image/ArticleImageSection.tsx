
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  ImagePlus,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ArticleImageSectionProps {
  onImageSelect: (imageUrl: string) => void;
  articleContent: string;
  articleTitle: string;
  onFinalize?: () => void;
  onNextStep?: () => Promise<string | undefined>;
}

export function ArticleImageSection({ 
  onImageSelect, 
  articleContent, 
  articleTitle,
  onFinalize,
  onNextStep
}: ArticleImageSectionProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");

  useEffect(() => {
    // Simulate image generation based on content and title
    const generateImages = async () => {
      setIsLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock image URLs
      const mockImages = [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=400&q=80",
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
        "https://images.unsplash.com/photo-1454779132693-e5cd0a216ed3?w=400&q=80",
        "https://images.unsplash.com/photo-1560419424-984965447454?w=400&q=80"
      ];
      setImages(mockImages);
      setIsLoading(false);
    };

    generateImages();
  }, [articleContent, articleTitle]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  const handleGenerateImages = async () => {
    setIsLoading(true);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock image URLs
    const mockImages = [
      "https://images.unsplash.com/photo-1546412454-695416c9a36f?w=400&q=80",
      "https://images.unsplash.com/photo-1606854814306-130949595dd0?w=400&q=80",
      "https://images.unsplash.com/photo-1590779033103-792c1318439f?w=400&q=80",
      "https://images.unsplash.com/photo-1560419424-984965447454?w=400&q=80"
    ];
    setImages(mockImages);
    setIsLoading(false);
  };

  const handleFinalize = () => {
    if (onNextStep) {
      onNextStep();
    } else if (onFinalize) {
      onFinalize();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-primary pl-4 py-2 bg-bg-gray">
        <h3 className="text-lg font-medium">Seleção de Imagem</h3>
        <p className="text-sm text-muted-foreground">Escolha uma imagem para ilustrar seu artigo</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((imageUrl, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-colors hover:border-primary ${selectedImage === imageUrl ? 'border-primary' : ''}`}
            onClick={() => handleImageSelect(imageUrl)}
          >
            <CardContent className="p-2">
              <img 
                src={imageUrl} 
                alt={`Imagem ${index + 1}`} 
                className="rounded-md aspect-video object-cover w-full" 
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleGenerateImages}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin mr-2" />
          ) : null}
          Gerar Novas Imagens
        </Button>
        
        <Button
          onClick={handleFinalize}
          disabled={isLoading}
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>
      </div>
    </div>
  );
}

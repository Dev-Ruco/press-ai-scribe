
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Check, Loader2, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsroomLogoUploadProps {
  onUploadComplete: (url: string) => void;
}

export function NewsroomLogoUpload({ onUploadComplete }: NewsroomLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadLogo = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Verificar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        throw new Error("Por favor, selecione uma imagem válida.");
      }
      
      // Verificar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("O arquivo é muito grande. O tamanho máximo é 5MB.");
      }
      
      // Simulação de upload para Supabase Storage
      // Em um ambiente real, enviaríamos para o bucket de armazenamento
      
      // Criar uma URL temporária para demonstração
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      
      // Simular um upload bem-sucedido após um breve delay
      setTimeout(() => {
        onUploadComplete(url);
        setIsUploading(false);
        toast({
          title: "Logo carregado com sucesso",
          description: "O logotipo foi carregado e suas cores foram extraídas."
        });
      }, 1500);
      
      // Na implementação real com Supabase:
      /*
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error, data } = await supabase.storage
        .from('organisations')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('organisations')
        .getPublicUrl(filePath);
        
      setLogoUrl(publicUrl);
      onUploadComplete(publicUrl);
      */
      
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao carregar o logo",
        description: error.message,
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  const handleRemove = () => {
    setLogoUrl(null);
    setError(null);
  };
  
  return (
    <div>
      {!logoUrl ? (
        <div 
          className={`bg-muted/40 border-2 border-dashed ${error ? 'border-destructive' : 'border-border'} rounded-lg flex flex-col items-center justify-center py-10 px-4`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="bg-primary/10 rounded-full p-3 mb-4">
            <Image className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Arraste seu logotipo aqui</h3>
          <p className="text-muted-foreground text-sm text-center mb-4">
            Suportamos PNG, JPG ou SVG até 5MB
          </p>
          <Button 
            variant="outline" 
            className="gap-2"
            disabled={isUploading}
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Selecionar Arquivo</span>
              </>
            )}
          </Button>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-lg border overflow-hidden">
            <img 
              src={logoUrl} 
              alt="Logo da redação" 
              className="w-full max-h-[200px] object-contain"
            />
          </div>
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center mt-2 text-sm text-primary gap-1">
            <Check className="h-4 w-4" />
            <span>Logotipo carregado com sucesso</span>
          </div>
        </div>
      )}
    </div>
  );
}

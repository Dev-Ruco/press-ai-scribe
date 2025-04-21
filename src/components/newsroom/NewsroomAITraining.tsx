
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Database, 
  Rss, 
  Globe, 
  ArrowRight, 
  FileText, 
  Check, 
  FilePlus,
  X,
  Loader2
} from "lucide-react";

interface NewsroomAITrainingProps {
  onFilesChange: (files: File[]) => void;
  onUrlsChange: (urls: string[]) => void;
}

export function NewsroomAITraining({ onFilesChange, onUrlsChange }: NewsroomAITrainingProps) {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [integrationUrls, setIntegrationUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Simular upload
    setTimeout(() => {
      const newFiles = Array.from(files);
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setIsUploading(false);
      
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivos foram adicionados para treino.`
      });
    }, 1000);
  };
  
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };
  
  const handleAddUrl = () => {
    if (!url) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      new URL(url);
    } catch (e) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedUrls = [...integrationUrls, url];
    setIntegrationUrls(updatedUrls);
    onUrlsChange(updatedUrls);
    setUrl("");
    
    toast({
      title: "URL adicionada",
      description: "A URL foi adicionada para treino da IA."
    });
  };
  
  const handleRemoveUrl = (index: number) => {
    const updatedUrls = [...integrationUrls];
    updatedUrls.splice(index, 1);
    setIntegrationUrls(updatedUrls);
    onUrlsChange(updatedUrls);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setIsUploading(true);
      
      // Simular upload
      setTimeout(() => {
        const newFiles = Array.from(event.dataTransfer.files);
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onFilesChange(updatedFiles);
        setIsUploading(false);
        
        toast({
          title: "Arquivos adicionados",
          description: `${newFiles.length} arquivos foram adicionados para treino.`
        });
      }, 1000);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="files" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload de Arquivos
          </TabsTrigger>
          <TabsTrigger value="integration" className="gap-2">
            <Database className="h-4 w-4" />
            Integração com Fontes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="space-y-4">
          <div 
            className="bg-muted/40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center py-10 px-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="bg-primary/10 rounded-full p-3 mb-4">
              <FilePlus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Arraste arquivos para treinar a IA</h3>
            <p className="text-muted-foreground text-sm text-center mb-4">
              Suportamos .txt, .docx, .pdf até 10MB
            </p>
            <Button 
              variant="outline" 
              className="gap-2"
              disabled={isUploading}
              onClick={() => document.getElementById('file-upload')?.click()}
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
              id="file-upload"
              className="hidden"
              accept=".txt,.docx,.pdf"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium mb-2">Arquivos para treino ({uploadedFiles.length})</h4>
              <div className="border rounded-md divide-y">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remover
                      </Button>
                      <div className="bg-primary/10 rounded-full p-1">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="font-medium mb-2">Integração com APIs e Feeds</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione URLs para WordPress, RSS ou sites para treinar a IA com seu conteúdo existente.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://seusite.com/feed" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddUrl}
                    className="gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>Adicionar</span>
                  </Button>
                </div>
                
                {integrationUrls.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {integrationUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          {url.includes('/feed') ? (
                            <Rss className="h-5 w-5 text-orange-500" />
                          ) : url.includes('/wp-json') ? (
                            <Database className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Globe className="h-5 w-5 text-green-500" />
                          )}
                          <p className="font-medium text-sm truncate max-w-[400px]">{url}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border rounded-md">
                    <p>Nenhuma URL adicionada ainda.</p>
                    <p className="text-sm">Adicione URLs para treinar a IA com seu conteúdo.</p>
                  </div>
                )}
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h5 className="font-medium text-sm mb-2">Formatos suportados:</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      WordPress REST API: <span className="text-muted-foreground">https://seusite.com/wp-json/wp/v2/posts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Rss className="h-4 w-4 text-primary" />
                      Feed RSS: <span className="text-muted-foreground">https://seusite.com/feed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      URL do site: <span className="text-muted-foreground">https://seusite.com/artigos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

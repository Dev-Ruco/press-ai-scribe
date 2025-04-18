
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Link2, ClipboardCopy, Download, ArrowLeft } from "lucide-react";
import { useState } from "react";

const TranscribePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <a href="/" className="flex items-center text-primary gap-2 hover:underline">
          <ArrowLeft size={16} />
          <span>Voltar para o Dashboard</span>
        </a>
      </div>
      
      <div className="mb-6">
        <h1 className="title-main text-primary-dark">Transcrever Áudio</h1>
        <p className="text-text-secondary mt-2">
          Converta arquivos de áudio ou vídeo em texto de forma rápida e precisa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload de Arquivo</TabsTrigger>
              <TabsTrigger value="link">Link de Vídeo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file">
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Arquivo</CardTitle>
                  <CardDescription>
                    Carregue um arquivo de áudio ou vídeo para transcrição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Input 
                      type="file" 
                      id="file-upload"
                      accept="audio/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-10 w-10 text-primary mb-4" />
                      <p className="text-text-primary font-medium mb-1">
                        {selectedFile ? selectedFile.name : "Clique para fazer upload"}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {selectedFile 
                          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                          : "Formatos suportados: MP3, MP4, WAV (máx. 500MB)"
                        }
                      </p>
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary-dark gap-2">
                    <Upload size={16} />
                    <span>Iniciar Transcrição</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="link">
              <Card>
                <CardHeader>
                  <CardTitle>Link de Vídeo</CardTitle>
                  <CardDescription>
                    Cole o link de um vídeo para transcrição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input 
                        placeholder="Cole o link do vídeo aqui (YouTube, Vimeo, etc)"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      <p className="text-xs text-text-secondary">
                        Exemplo: https://www.youtube.com/watch?v=...
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark gap-2"
                    disabled={!videoLink}
                  >
                    <Link2 size={16} />
                    <span>Iniciar Transcrição</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Preview da Transcrição</CardTitle>
                <CardDescription>
                  O texto transcrito será exibido aqui
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <ClipboardCopy size={14} />
                  <span>Copiar</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download size={14} />
                  <span>Baixar</span>
                </Button>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-4">
              <Textarea 
                placeholder="A transcrição do seu arquivo aparecerá aqui quando o processamento estiver concluído."
                className="min-h-[400px] resize-none"
                readOnly
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TranscribePage;

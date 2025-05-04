
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Headphones, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ProcessingOverlay } from "@/components/article/processing/ProcessingOverlay";
import { createTranscription } from "@/services/transcriptionService";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";

const CreateTranscriptionPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [processingState, setProcessingState] = useState({
    isVisible: false,
    stage: "uploading" as "uploading" | "analyzing" | "completed" | "error",
    progress: 0,
    statusMessage: "",
    error: ""
  });
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadFile } = useSupabaseStorage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validar se é um arquivo de áudio
      if (!selectedFile.type.startsWith('audio/')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, faça upload apenas de arquivos de áudio.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-populate name with filename if empty
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    
    if (!name || !file) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setProcessingState({
        isVisible: true,
        stage: "uploading",
        progress: 20,
        statusMessage: "Fazendo upload do arquivo de áudio...",
        error: ""
      });
      
      // Upload do arquivo para o Supabase Storage
      const uploadedFile = await uploadFile(file);
      
      setProcessingState({
        isVisible: true,
        stage: "analyzing",
        progress: 50,
        statusMessage: "Preparando para transcrição...",
        error: ""
      });
      
      // Criar a transcrição e enviar para processamento
      const result = await createTranscription(
        { name }, 
        { 
          url: uploadedFile.url, 
          fileName: uploadedFile.fileName, 
          mimeType: uploadedFile.mimeType, 
          fileSize: uploadedFile.fileSize 
        }
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setProcessingState({
        isVisible: true,
        stage: "completed",
        progress: 100,
        statusMessage: "Transcrição iniciada com sucesso!",
        error: ""
      });
      
      toast({
        title: "Transcrição criada",
        description: "Sua transcrição foi iniciada e estará disponível em breve.",
      });
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        navigate('/transcribe');
      }, 2000);
      
    } catch (error) {
      console.error("Error creating transcription:", error);
      
      setProcessingState({
        isVisible: true,
        stage: "error",
        progress: 0,
        statusMessage: "Erro ao criar transcrição",
        error: error.message || "Ocorreu um erro ao processar sua solicitação."
      });
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a transcrição. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleProcessingCancel = () => {
    setProcessingState(prev => ({
      ...prev,
      isVisible: false
    }));
  };
  
  const handleRetry = () => {
    if (name && file) {
      handleSubmit(new Event('retry') as unknown as React.FormEvent);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/transcribe')}
            className="mb-4 pl-0 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar para Transcrições
          </Button>
          
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Headphones className="h-8 w-8" />
            Nova Transcrição
          </h1>
          <p className="text-muted-foreground mt-2">
            Faça upload de um arquivo de áudio para transcrever
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Upload de Áudio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Transcrição</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite um nome para identificar esta transcrição"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audioFile">Arquivo de Áudio</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {file ? file.name : "Arraste e solte ou clique para fazer upload"}
                  </p>
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById("audioFile")?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={processingState.isVisible || !name || !file}
              >
                Iniciar Transcrição
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <ProcessingOverlay 
        isVisible={processingState.isVisible}
        stage={processingState.stage}
        progress={processingState.progress}
        statusMessage={processingState.statusMessage}
        error={processingState.error}
        onCancel={handleProcessingCancel}
        onRetry={handleRetry}
      />
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => handleSubmit}
      />
    </MainLayout>
  );
};

export default CreateTranscriptionPage;

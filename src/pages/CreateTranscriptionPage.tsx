
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Headphones, Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthDialog } from "@/components/auth/AuthDialog";

const CreateTranscriptionPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Auto-populate name with filename if empty
      if (!name) {
        setName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
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
      setIsUploading(true);
      
      // Create transcription record
      const { data, error } = await supabase
        .from('transcriptions')
        .insert({
          name,
          user_id: user.id,
          status: "pending",
          file_path: `transcriptions/${user.id}/${Date.now()}_${file.name}`
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Transcrição criada",
        description: "Sua transcrição foi iniciada e estará disponível em breve.",
      });
      
      navigate('/transcribe');
    } catch (error) {
      console.error("Error creating transcription:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a transcrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
                disabled={isUploading || !name || !file}
              >
                {isUploading ? "Enviando..." : "Iniciar Transcrição"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => handleSubmit}
      />
    </MainLayout>
  );
};

export default CreateTranscriptionPage;

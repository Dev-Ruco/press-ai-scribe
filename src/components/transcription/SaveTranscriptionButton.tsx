
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { sendTranscriptionToCustomWebhook } from "@/utils/webhookUtils";

interface SaveTranscriptionButtonProps {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  transcriptionText: string;
  disabled?: boolean;
}

export function SaveTranscriptionButton({
  fileName,
  fileUrl,
  mimeType,
  transcriptionText,
  disabled = false
}: SaveTranscriptionButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleSaveTranscription = async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    
    if (!transcriptionText) {
      toast({
        title: "Erro",
        description: "Não há texto de transcrição para salvar",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await sendTranscriptionToCustomWebhook(
        fileName,
        fileUrl,
        mimeType,
        transcriptionText
      );
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Transcrição enviada com sucesso",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao salvar transcrição:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar transcrição",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleSaveTranscription}
        disabled={disabled || isLoading}
        className="flex items-center gap-2"
      >
        <Save size={16} />
        {isLoading ? "Enviando..." : "Guardar Transcrição"}
      </Button>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={handleSaveTranscription}
      />
    </>
  );
}

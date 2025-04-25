
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Headphones, Upload, Plus } from "lucide-react";
import { TranscriptionHistory } from "@/components/transcription/TranscriptionHistory";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";

const TranscribePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleNewTranscription = () => {
    if (user) {
      navigate('/transcribe/new');
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Headphones className="h-8 w-8" />
              Transcrições
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as suas transcrições em um só lugar
            </p>
          </div>
          <Button onClick={handleNewTranscription} className="flex items-center gap-2">
            <Plus size={16} />
            Nova Transcrição
          </Button>
        </div>

        <div className="mt-6">
          <TranscriptionHistory />
        </div>
      </div>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={() => navigate('/transcribe/new')}
      />
    </MainLayout>
  );
};

export default TranscribePage;

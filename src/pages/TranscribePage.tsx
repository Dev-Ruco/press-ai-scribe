
import { MainLayout } from "@/components/layout/MainLayout";
import { Headphones } from "lucide-react";
import { TranscriptionHistory } from "@/components/transcription/TranscriptionHistory";

const TranscribePage = () => {
  // Empty array for transcriptions when no user is logged in
  const recentTranscriptions = [];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Headphones className="h-8 w-8" />
            Transcrições
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as suas transcrições em um só lugar
          </p>
        </div>

        <div className="mt-6">
          <TranscriptionHistory transcriptions={recentTranscriptions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TranscribePage;

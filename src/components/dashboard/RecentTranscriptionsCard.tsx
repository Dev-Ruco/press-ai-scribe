
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

type Transcription = {
  id: string;
  name: string;
  created_at: string;
};

export function RecentTranscriptionsCard({ limit = 4 }: { limit?: number }) {
  const { user } = useAuth();
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transcriptions")
      .select("id, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setTranscriptions(data || []);
      });
  }, [user, limit]);

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-primary-dark text-base flex justify-between items-center">
          Últimas Transcrições
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/transcribe")}
          >
            Ver mais
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transcriptions.length === 0 ? (
          <div className="py-4 text-muted-foreground text-center">
            Nenhuma transcrição feita ainda.
          </div>
        ) : (
          <ul className="divide-y">
            {transcriptions.map((t) => (
              <li key={t.id} className="py-2 flex justify-between items-center">
                <span className="font-medium">{t.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/transcribe")}
                  className="text-muted-foreground"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

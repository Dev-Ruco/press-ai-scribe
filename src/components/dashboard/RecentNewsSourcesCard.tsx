
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

type Source = {
  id: string;
  name: string;
  created_at: string;
};

export function RecentNewsSourcesCard({ limit = 4 }: { limit?: number }) {
  const { user } = useAuth();
  const [sources, setSources] = useState<Source[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("news_sources")
      .select("id, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setSources(data || []);
      });
  }, [user, limit]);

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-primary-dark text-base flex justify-between items-center">
          Últimas Fontes Adicionadas
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/news")}
          >
            Ver mais
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sources.length === 0 ? (
          <div className="py-4 text-muted-foreground text-center">
            Nenhuma fonte cadastrada ainda.
          </div>
        ) : (
          <ul className="divide-y">
            {sources.map((s) => (
              <li key={s.id} className="py-2 flex justify-between items-center">
                <span className="font-medium">{s.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/news")}
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

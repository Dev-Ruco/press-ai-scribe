
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

type Article = {
  id: string;
  title: string;
  created_at: string;
};

export function RecentArticlesCard({ limit = 4 }: { limit?: number }) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const navigate = useNavigate();

  // For now, we're using an empty array for articles since the articles table no longer exists
  // When we re-add the tables in the future, we can replace this with actual data fetching

  if (!user) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-primary-dark text-base flex justify-between items-center">
          Últimos Artigos
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/articles")}
          >
            Ver mais
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {articles.length === 0 ? (
          <div className="py-4 text-muted-foreground text-center">
            Nenhum artigo criado ainda.
          </div>
        ) : (
          <ul className="divide-y">
            {articles.map((art) => (
              <li key={art.id} className="py-2 flex justify-between items-center">
                <span
                  className="font-medium cursor-pointer hover:text-primary transition"
                  onClick={() => navigate(`/articles/${art.id}`)}
                >
                  {art.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/articles/${art.id}`)}
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

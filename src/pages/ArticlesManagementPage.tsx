
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePen, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Article {
  id: string;
  title: string;
  status: string;
  date: string;
  author: string;
  type: string;
}

export default function ArticlesManagementPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchArticles();
    } else {
      setArticles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("user_id", user?.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          status: article.status || "draft",
          date: new Date(article.created_at).toLocaleDateString("pt-BR"),
          author: user?.email?.split("@")[0] || "Você",
          type: article.type || "Notícia"
        }));
        
        setArticles(formattedArticles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Gestão de Artigos</h2>
            <p className="text-sm text-muted-foreground">
              Gerencie todos os seus artigos em um único lugar
            </p>
          </div>
          <Button asChild>
            <Link to="/new-article" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Artigo
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Artigos</CardTitle>
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar artigos..."
                  className="w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando artigos...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' :
                          article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status}
                        </span>
                      </TableCell>
                      <TableCell>{article.date}</TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>{article.type}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FilePen className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p>Nenhum artigo encontrado. Crie seu primeiro artigo!</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {}}
                  asChild
                >
                  <Link to="/new-article">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Artigo
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

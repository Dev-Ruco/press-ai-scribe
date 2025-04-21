import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePen, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const mockArticles: any[] = [];

export default function ArticlesManagementPage() {
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
                />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {mockArticles.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum artigo criado. Crie o primeiro!
              </div>
            ) : (
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
                  {mockArticles.map((article) => (
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
                      <TableCell>{article.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FilePen className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

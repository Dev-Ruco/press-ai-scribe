
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Notícias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma notícia disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Artigos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhum artigo disponível</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transcrições</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma transcrição disponível</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

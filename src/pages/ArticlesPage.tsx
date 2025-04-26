
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArticlesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seus Artigos</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhum artigo disponível</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

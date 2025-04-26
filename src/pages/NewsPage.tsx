
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewsPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search size={24} className="text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Notícias</h1>
          </div>
        </div>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-6 bg-bg-white border border-border">
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Notícias</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Notícias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma notícia disponível</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Notícias</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma fonte de notícia disponível</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nenhuma configuração disponível</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NewsPage;

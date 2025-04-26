
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { NewsList } from '@/components/news/NewsList';
import { NewsSourcesList } from '@/components/news/NewsSourcesList';
import { NewsStatsCards } from '@/components/news/NewsStatsCards';

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
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <NewsList />
          </TabsContent>
          
          <TabsContent value="sources">
            <NewsSourcesList />
          </TabsContent>
          
          <TabsContent value="stats">
            <NewsStatsCards />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NewsPage;

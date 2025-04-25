
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { NewsList } from '@/components/news/NewsList';
import { NewsSourcesList } from '@/components/news/NewsSourcesList';
import { NewsSettings } from '@/components/news/NewsSettings';

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search size={24} className="text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Últimas Notícias</h1>
          </div>
          <p className="text-text-secondary">Monitore as notícias mais recentes de diversas fontes</p>
        </div>

        {/* Tabs */}
        <Tabs 
          defaultValue="news" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 bg-bg-white border border-border">
            <TabsTrigger 
              value="news"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              Notícias
            </TabsTrigger>
            <TabsTrigger 
              value="sources"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              Fontes de Notícias
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <NewsList />
          </TabsContent>
          
          <TabsContent value="sources">
            <NewsSourcesList />
          </TabsContent>
          
          <TabsContent value="settings">
            <NewsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NewsPage;

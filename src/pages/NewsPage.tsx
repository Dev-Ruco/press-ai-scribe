
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronLeft, ChevronRight, Clock, RefreshCw, Plus, Edit, Pause, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { NewsList } from '@/components/news/NewsList';
import { NewsSourcesList } from '@/components/news/NewsSourcesList';
import { NewsSettings } from '@/components/news/NewsSettings';
import { NewsStatsCards } from '@/components/news/NewsStatsCards';

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
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Notícias</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <NewsList />
          </TabsContent>
          
          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NewsSourcesList />
              </div>
              <div>
                <NewsStatsCards />
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <NewsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NewsPage;

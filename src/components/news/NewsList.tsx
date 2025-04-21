
import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewsCard } from './NewsCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useAuth } from '@/contexts/AuthContext';

export const NewsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const { user } = useAuth();
  
  // Sem dados simulados para usuários não autenticados
  const newsItems = user ? [] : [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-border shadow-sm">
        <div className="w-full md:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="min-w-[180px] hover:border-primary/70 transition-all duration-200">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="Política">Política</SelectItem>
              <SelectItem value="Economia">Economia</SelectItem>
              <SelectItem value="Cultura">Cultura</SelectItem>
              <SelectItem value="Esportes">Esportes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-auto">
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="min-w-[180px] hover:border-primary/70 transition-all duration-200">
              <SelectValue placeholder="Todas as fontes" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">Todas as fontes</SelectItem>
              <SelectItem value="Lusa">Lusa</SelectItem>
              <SelectItem value="DW">DW</SelectItem>
              <SelectItem value="Carta de Moçambique">Carta de Moçambique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              className="pl-10 hover:border-primary/70 transition-all duration-200"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* News Cards */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-0">
          {!user ? (
            <div className="py-12 text-center text-text-secondary">
              <p className="mb-4">Faça login para ver suas notícias.</p>
              <Button asChild>
                <a href="/auth" className="gap-2">
                  Entrar na sua conta
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="py-12 text-center text-text-secondary">
              <p>Nenhuma notícia encontrada. Adicione fontes de notícias para começar!</p>
            </div>
          ) : (
            newsItems.map(news => (
              <NewsCard key={news.id} news={news} />
            ))
          )}
        </CardContent>
      </Card>
      
      {newsItems.length > 0 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="hover:bg-primary/10 transition-all duration-200" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive className="hover:bg-primary/20 transition-all duration-200">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" className="hover:bg-primary/10 transition-all duration-200" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

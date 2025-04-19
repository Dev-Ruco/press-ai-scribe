
import { useState } from 'react';
import { Search, Clock, RefreshCw } from 'lucide-react';
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

// Sample news data for demonstration
const sampleNews = [
  {
    id: 1,
    title: 'Novo plano econômico é anunciado pelo governo',
    category: 'Política',
    source: 'Lusa',
    time: '14:30',
    date: '18/04/2025'
  },
  {
    id: 2,
    title: 'Equipe nacional se classifica para copa mundial',
    category: 'Esportes',
    source: 'DW',
    time: '12:15',
    date: '18/04/2025'
  },
  {
    id: 3,
    title: 'Festival de cinema anuncia premiados',
    category: 'Cultura',
    source: 'Carta de Moçambique',
    time: '10:45',
    date: '18/04/2025'
  },
  {
    id: 4,
    title: 'Bolsa de valores registra alta pelo terceiro dia',
    category: 'Economia',
    source: 'Lusa',
    time: '09:20',
    date: '18/04/2025'
  },
  {
    id: 5,
    title: 'Nova exposição de arte contemporânea abre ao público',
    category: 'Cultura',
    source: 'DW',
    time: '08:00',
    date: '18/04/2025'
  },
];

export const NewsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  
  // Filter logic for news items
  const filteredNews = sampleNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || news.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || news.source === sourceFilter;
    return matchesSearch && matchesCategory && matchesSource;
  });

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
          {filteredNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
          
          {filteredNews.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              <p>Nenhuma notícia encontrada para os filtros selecionados.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pagination */}
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
              <PaginationLink href="#" className="hover:bg-primary/10 transition-all duration-200">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-primary/10 transition-all duration-200">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="hover:bg-primary/10 transition-all duration-200" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

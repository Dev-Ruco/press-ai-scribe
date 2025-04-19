
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArticleFiltersState } from '@/types/article';
import { filterOptions } from '@/data/mockArticles';
import { 
  Search, 
  Calendar, 
  Globe, 
  FileText, 
  Tag, 
  Check,
  User
} from "lucide-react";

interface ArticleFiltersProps {
  filters: ArticleFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ArticleFiltersState>>;
}

export function ArticleFilters({ filters, setFilters }: ArticleFiltersProps) {
  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleMonthChange = (value: string) => {
    setFilters({ ...filters, month: value });
  };

  const handleYearChange = (value: string) => {
    setFilters({ ...filters, year: value });
  };

  const handlePlatformChange = (value: string) => {
    setFilters({ ...filters, platform: value });
  };

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, type: value });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, tags: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  const handleOnlyMineChange = (checked: boolean) => {
    setFilters({ ...filters, onlyMine: checked });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="relative">
        <Label htmlFor="search">
          <Search className="h-4 w-4 absolute left-3 top-[2.35rem] text-muted-foreground" />
          <span className="ml-1">Pesquisar</span>
        </Label>
        <Input
          id="search"
          placeholder="Título ou autor"
          value={filters.search}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <Label className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Mês
          </Label>
          <Select value={filters.month} onValueChange={handleMonthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-1/2">
          <Label>Ano</Label>
          <Select value={filters.year} onValueChange={handleYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Globe className="h-4 w-4" /> Plataforma
        </Label>
        <Select value={filters.platform} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {filterOptions.platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <FileText className="h-4 w-4" /> Tipo de Artigo
        </Label>
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {filterOptions.articleTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Label htmlFor="tags" className="flex items-center gap-1">
          <Tag className="h-4 w-4" /> Etiquetas
        </Label>
        <Input
          id="tags"
          placeholder="Separadas por vírgulas"
          value={filters.tags}
          onChange={handleTagsChange}
        />
      </div>

      <div>
        <Label className="flex items-center gap-1">
          <Check className="h-4 w-4" /> Estado
        </Label>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {filterOptions.statuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="onlyMine" 
            checked={filters.onlyMine} 
            onCheckedChange={handleOnlyMineChange} 
          />
          <Label htmlFor="onlyMine" className="flex items-center gap-1">
            <User className="h-4 w-4" /> Apenas meus artigos
          </Label>
        </div>
      </div>
    </div>
  );
}

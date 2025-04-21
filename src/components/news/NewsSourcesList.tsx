
import { useState } from 'react';
import { Plus, Edit, Pause, Trash2, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewsSourceForm } from './NewsSourceForm';

// Sample sources data
const sampleSources = [
  {
    id: 1,
    name: 'Lusa',
    url: 'https://www.lusa.pt/rss',
    category: 'Geral',
    status: 'active'
  },
  {
    id: 2,
    name: 'Deutsche Welle',
    url: 'https://www.dw.com/rss',
    category: 'Internacional',
    status: 'active'
  },
  {
    id: 3,
    name: 'Carta de Moçambique',
    url: 'https://cartamz.com/feed',
    category: 'Nacional',
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Jornal Econômico',
    url: 'https://jornaleco.com/feed',
    category: 'Economia',
    status: 'active'
  }
];

export const NewsSourcesList = () => {
  const [sources, setSources] = useState(sampleSources);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<(typeof sampleSources)[0] | null>(null);

  const handleAddSource = () => {
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEditSource = (source: (typeof sampleSources)[0]) => {
    setEditingSource(source);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fontes de Notícias</CardTitle>
          <Button onClick={handleAddSource} size="sm">
            <Plus size={16} className="mr-1" />
            Adicionar Fonte
          </Button>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <NewsSourceForm 
              source={editingSource} 
              onCancel={() => setShowForm(false)} 
              onSave={(source) => {
                // Handle save logic
                setShowForm(false);
              }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">URL</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                      {source.url}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{source.category}</TableCell>
                    <TableCell>
                      {source.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-success">
                          <Check size={16} />
                          <span className="hidden md:inline">Ativo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <X size={16} />
                          <span className="hidden md:inline">Inativo</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSource(source)}>
                          <Edit size={16} />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pause size={16} />
                          <span className="sr-only">Pausar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error hover:text-error/80">
                          <Trash2 size={16} />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

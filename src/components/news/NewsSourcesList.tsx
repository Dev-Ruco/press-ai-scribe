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
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

export const NewsSourcesList = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);

  const handleAddSource = () => {
    if (!user) {
      setPromptOpen(true);
      return;
    }
    setEditingSource(null);
    setShowForm(true);
  };

  const handleEditSource = (source: any) => {
    if (!user) {
      setPromptOpen(true);
      return;
    }
    setEditingSource(source);
    setShowForm(true);
  };

  // Não há notícias mockadas
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
                if (!user) {
                  setPromptOpen(true);
                  return;
                }
                setShowForm(false);
                // Aqui deve-se salvar de fato no Supabase
                // Exemplo: chamar função para inserir/atualizar news_sources usando o supabase
              }}
            />
          ) : sources.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Nenhuma fonte cadastrada. Adicione sua primeira fonte!
            </div>
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
                        <Button variant="ghost" size="sm" onClick={() => !user && setPromptOpen(true)}>
                          <Pause size={16} />
                          <span className="sr-only">Pausar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error hover:text-error/80" onClick={() => !user && setPromptOpen(true)}>
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
      <AuthPrompt isOpen={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
};

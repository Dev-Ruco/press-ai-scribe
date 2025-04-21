
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface SourceFormProps {
  source: {
    id: number;
    name: string;
    url: string;
    category: string;
    status: string;
  } | null;
  onCancel: () => void;
  onSave: (source: any) => void;
}

export const NewsSourceForm = ({ source, onCancel, onSave }: SourceFormProps) => {
  const isEditing = Boolean(source);
  
  const form = useForm({
    defaultValues: {
      name: source?.name || '',
      url: source?.url || '',
      category: source?.category || 'Geral',
      frequency: 'hourly'
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      id: source?.id || Date.now(),
      status: source?.status || 'active'
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Fonte</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da fonte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL (RSS ou Site)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/feed" {...field} />
              </FormControl>
              <FormDescription>
                Insira o URL do feed RSS ou da página principal do site.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Geral">Geral</SelectItem>
                  <SelectItem value="Política">Política</SelectItem>
                  <SelectItem value="Economia">Economia</SelectItem>
                  <SelectItem value="Cultura">Cultura</SelectItem>
                  <SelectItem value="Esportes">Esportes</SelectItem>
                  <SelectItem value="Internacional">Internacional</SelectItem>
                  <SelectItem value="Nacional">Nacional</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequência de Monitoramento</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="realtime">Em tempo real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Salvar Alterações' : 'Adicionar Fonte'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

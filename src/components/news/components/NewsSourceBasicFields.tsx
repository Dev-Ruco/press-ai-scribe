
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { SourceFormValues } from '../types/news-source-form';

interface NewsSourceBasicFieldsProps {
  form: UseFormReturn<SourceFormValues>;
}

export const NewsSourceBasicFields = ({ form }: NewsSourceBasicFieldsProps) => {
  return (
    <>
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
    </>
  );
};

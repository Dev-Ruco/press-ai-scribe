
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { SourceAuthSection } from './SourceAuthSection';
import { NewsSourceBasicFields } from './components/NewsSourceBasicFields';
import { useNewsSourceForm } from './hooks/useNewsSourceForm';
import { SourceFormProps } from './types/news-source-form';

export const NewsSourceForm = ({ source, onCancel, onSave, isSaving = false }: SourceFormProps) => {
  const isEditing = Boolean(source?.id);
  const { form, onSubmit } = useNewsSourceForm(source, onSave);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <NewsSourceBasicFields form={form} />
        <SourceAuthSection form={form} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            type="button"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Salvando...' : 'Adicionando...'}
              </>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Adicionar Fonte'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { N8N_WEBHOOK_URL, sendArticleToN8N } from '@/utils/webhookUtils';
import { SourceFormValues, sourceFormSchema } from '../types/news-source-form';
import { NewsSource } from '@/types/news';

export const useNewsSourceForm = (
  source: Partial<NewsSource> | null,
  onSave: (source: any) => Promise<any>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const defaultValues: Partial<SourceFormValues> = {
    name: source?.name || '',
    url: source?.url || '',
    category: source?.category || 'Geral',
    frequency: source?.frequency || 'daily',
    auth_config: {
      method: (source?.auth_config?.method as any) || 'none',
      ...(source?.auth_config || {})
    }
  };

  const form = useForm<SourceFormValues>({
    resolver: zodResolver(sourceFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SourceFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar uma fonte.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sourceData: Partial<NewsSource> = {
        id: source?.id,
        name: data.name,
        url: data.url,
        category: data.category,
        frequency: data.frequency,
        auth_config: data.auth_config.method === 'none' ? null : {
          ...data.auth_config,
          method: data.auth_config.method
        }
      };

      const savedSource = await onSave(sourceData);
      
      if (!savedSource?.id) {
        throw new Error('Erro ao salvar a fonte');
      }

      toast({
        title: source?.id ? "Fonte atualizada" : "Fonte adicionada",
        description: `A fonte "${data.name}" foi ${source?.id ? 'atualizada' : 'adicionada'} com sucesso.`,
      });

      try {
        console.log('Iniciando comunicação com n8n...');
        
        // Creating a valid payload for webhook
        const fileUrls = [{
          url: data.url,
          fileName: data.name,
          mimeType: 'text/uri-list',
          fileType: 'document' as 'audio' | 'document' | 'image',
          fileSize: 0
        }];

        const response = await sendArticleToN8N(
          `Nova fonte de notícias: ${data.name}`,
          'Fonte de Notícias',
          fileUrls,
          [data.url]
        );

        if (response.success) {
          toast({
            title: "Comunicação com n8n",
            description: "Webhook acionado com sucesso! O n8n irá processar sua solicitação.",
          });
        } else {
          throw new Error(response.error);
        }
      } catch (webhookError) {
        console.error('Erro ao enviar dados para n8n:', webhookError);
        toast({
          variant: "destructive",
          title: "Erro na comunicação",
          description: "Não foi possível se comunicar com o n8n. Por favor, tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar fonte:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a fonte de notícias. Tente novamente.",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};

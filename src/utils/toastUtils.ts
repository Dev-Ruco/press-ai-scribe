
import { useToast } from "@/hooks/use-toast";
import { N8N_WEBHOOK_URL } from '@/utils/webhook/types';

export const showSuccessToast = (message: string = `Conteúdo enviado com sucesso para ${N8N_WEBHOOK_URL}!`) => {
  const { toast } = useToast();
  toast({
    title: "Sucesso",
    description: message,
  });
};

export const showErrorToast = (error: string = 'Erro desconhecido') => {
  const { toast } = useToast();
  toast({
    variant: "destructive",
    title: "Erro",
    description: `Não foi possível enviar o conteúdo para ${N8N_WEBHOOK_URL}: ${error}`,
  });
};

export const showCancelToast = () => {
  const { toast } = useToast();
  toast({
    title: "Processamento cancelado",
    description: `O envio para ${N8N_WEBHOOK_URL} foi interrompido pelo usuário.`
  });
};

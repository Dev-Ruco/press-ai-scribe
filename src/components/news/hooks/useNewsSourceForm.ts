
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendArticleToN8N } from "@/utils/webhookUtils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sourceFormSchema } from "@/components/news/types/news-source-form";

export const useNewsSourceForm = (initialData = null, onSaveCallback?: (data: any) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(sourceFormSchema),
    defaultValues: initialData || {
      name: "",
      url: "",
      category: "notícias",
      frequency: "daily",
      auth_config: {
        method: "none",
      }
    },
  });
  
  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para adicionar uma fonte."
        });
        return;
      }
      
      const userId = session.user.id;
      
      // Prepare source data
      const sourceData = {
        name: values.name,
        url: values.url,
        category: values.category,
        frequency: values.frequency,
        auth_config: values.auth_config,
        user_id: userId
      };

      // Insert into database
      const { data, error } = await supabase
        .from('news_sources')
        .insert(sourceData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Notify webhook about new source
      try {
        await sendArticleToN8N(
          `Nova fonte adicionada: ${values.name}`,
          'Fonte de Notícias',
          [],
          [values.url]
        );
      } catch (webhookError) {
        console.error("Error notifying webhook:", webhookError);
        // We don't want to fail the whole operation if webhook notification fails
      }

      toast({
        title: "Fonte adicionada",
        description: "A fonte de notícias foi adicionada com sucesso."
      });

      if (onSaveCallback) {
        onSaveCallback(data);
      }
      
      return data;
      
    } catch (error) {
      console.error("Error adding news source:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar fonte de notícias"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting
  };
};

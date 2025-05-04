
import { useState } from "react";
import { SourceFormData } from "@/components/news/types/news-source-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendArticleToN8N } from "@/utils/webhookUtils";

export const useNewsSourceForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SourceFormData>({
    name: "",
    url: "",
    category: "notícias",
    frequency: "daily",
    auth_type: "none",
    username: "",
    password: "",
    api_key: "",
    api_secret: "",
    oauth_token: "",
    oauth_secret: ""
  });
  
  const { toast } = useToast();
  
  const handleInputChange = (field: keyof SourceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome da fonte é obrigatório."
      });
      return false;
    }

    if (!formData.url.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "URL da fonte é obrigatório."
      });
      return false;
    }

    // Add more validation as needed
    return true;
  };

  const constructAuthConfig = () => {
    switch (formData.auth_type) {
      case "basic":
        return {
          type: "basic",
          username: formData.username,
          password: formData.password
        };
      case "api_key":
        return {
          type: "api_key",
          key: formData.api_key,
          secret: formData.api_secret || undefined
        };
      case "oauth":
        return {
          type: "oauth",
          token: formData.oauth_token,
          secret: formData.oauth_secret || undefined
        };
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        name: formData.name,
        url: formData.url,
        category: formData.category,
        frequency: formData.frequency,
        auth_config: constructAuthConfig(),
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
          `Nova fonte adicionada: ${formData.name}`,
          'Fonte de Notícias',
          [],
          [formData.url]
        );
      } catch (webhookError) {
        console.error("Error notifying webhook:", webhookError);
        // We don't want to fail the whole operation if webhook notification fails
      }

      toast({
        title: "Fonte adicionada",
        description: "A fonte de notícias foi adicionada com sucesso."
      });

      // Return the created source
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
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting
  };
};

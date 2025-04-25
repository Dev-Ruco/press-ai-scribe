
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';

export async function saveArticles(sourceId: string, articles: NewsArticle[]) {
  try {
    console.log('Iniciando saveArticles com sourceId:', sourceId, 'e articles:', articles);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');
    
    console.log('Usuário autenticado:', user.id);

    const { data, error } = await supabase.from('raw_news').insert(
      articles.map(article => ({
        user_id: user.id,
        source_id: sourceId,
        title: article.title,
        content: article.content,
        link: article.link,
        published_at: article.published_at,
        state: 'nova'
      }))
    ).select();

    if (error) {
      console.error('Erro ao salvar artigos:', error);
      throw error;
    }
    
    console.log('Artigos salvos com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro em saveArticles:', error);
    throw error;
  }
}


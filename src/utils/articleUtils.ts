
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/news';

export async function saveArticles(sourceId: string, articles: NewsArticle[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user found');

    const { error } = await supabase.from('raw_news').insert(
      articles.map(article => ({
        user_id: user.id,
        source_id: sourceId,
        title: article.title,
        content: article.content,
        link: article.link,
        published_at: article.published_at,
        state: 'nova'
      }))
    );

    if (error) throw error;
    
    console.log('Articles saved successfully:', articles.length);
  } catch (error) {
    console.error('Error saving articles:', error);
    throw error;
  }
}


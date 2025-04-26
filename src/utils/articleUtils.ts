
import { NewsArticle } from '@/types/news';

export async function saveArticles(sourceId: string, articles: NewsArticle[]) {
  try {
    console.log('Salvando artigos:', articles);
    // Since we no longer have the raw_news table, this is just a stub function
    // that mimics the behavior but doesn't interact with the database
    return [];
  } catch (error) {
    console.error('Erro em saveArticles:', error);
    throw error;
  }
}

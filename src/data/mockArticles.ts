
import { ArticleWithActions } from '@/types/article';

// Empty array for articles - we won't use mock data anymore
export const mockArticles: ArticleWithActions[] = [];

// Filter options for the UI are still needed
export const filterOptions = {
  platforms: ["WordPress", "Redes Sociais", "Newsletter"],
  articleTypes: ["Notícia", "Reportagem", "Análise", "Entrevista", "Opinião"],
  statuses: ["Publicado", "Rascunho", "Pendente", "Rejeitado"]
};

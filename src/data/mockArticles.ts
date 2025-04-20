
import { ArticleWithActions } from '@/types/article';

export const mockArticles: ArticleWithActions[] = [];

export const filterOptions = {
  platforms: ["WordPress", "Redes Sociais", "Newsletter"],
  articleTypes: ["Notícia", "Reportagem", "Análise", "Entrevista", "Opinião"],
  statuses: ["Publicado", "Rascunho", "Pendente", "Rejeitado"]
};

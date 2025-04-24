
export type ArticleStatus = "Publicado" | "Rascunho" | "Pendente" | "Rejeitado";
export type ArticlePlatform = "WordPress" | "Redes Sociais" | "Newsletter" | "Web";
export type ArticleType = "Notícia" | "Reportagem" | "Análise" | "Entrevista" | "Opinião" | "Artigo";

export interface Article {
  id: string;
  title: string;
  author: string;
  type: ArticleType;
  platform: ArticlePlatform;
  status: ArticleStatus;
  publishDate: string;
  tags: string[];
}

export interface ArticleWithActions extends Article {
  // No additional fields needed, just for semantic clarity
}

export interface ArticleFiltersState {
  search: string;
  month: string;
  year: string;
  platform: string;
  type: string;
  tags: string;
  status: string;
  onlyMine: boolean;
}

// Add new interface for article type objects
export interface ArticleTypeObject {
  id: string;
  label: string;
  structure: string[];
}

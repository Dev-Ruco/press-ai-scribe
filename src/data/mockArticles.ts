
import { ArticleWithActions } from '@/types/article';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Mock article data
export const mockArticles: ArticleWithActions[] = [
  {
    id: generateId(),
    title: "O impacto da IA no jornalismo moderno",
    author: "Rafael",
    type: "Reportagem",
    platform: "WordPress",
    status: "Publicado",
    publishDate: new Date(2025, 3, 15).toISOString(),
    tags: ["IA", "Jornalismo", "Tecnologia"],
  },
  {
    id: generateId(),
    title: "Análise de dados: Como jornalistas podem aproveitar o aprendizado de máquina",
    author: "Maria Silva",
    type: "Análise",
    platform: "Newsletter",
    status: "Rascunho",
    publishDate: new Date(2025, 2, 22).toISOString(),
    tags: ["Dados", "Machine Learning", "Jornalismo de dados"],
  },
  {
    id: generateId(),
    title: "Os desafios éticos da automação na criação de conteúdo",
    author: "Rafael",
    type: "Opinião",
    platform: "Redes Sociais",
    status: "Pendente",
    publishDate: new Date(2025, 3, 10).toISOString(),
    tags: ["Ética", "Automação", "Conteúdo"],
  },
  {
    id: generateId(),
    title: "Entrevista com especialistas: O futuro da redação digital",
    author: "João Mendes",
    type: "Entrevista",
    platform: "WordPress",
    status: "Rejeitado",
    publishDate: new Date(2025, 3, 5).toISOString(),
    tags: ["Futuro", "Digital", "Redação"],
  },
  {
    id: generateId(),
    title: "Como a IA está mudando o fact-checking jornalístico",
    author: "Rafael",
    type: "Notícia",
    platform: "Redes Sociais",
    status: "Publicado",
    publishDate: new Date(2025, 2, 28).toISOString(),
    tags: ["Fact-checking", "IA", "Verificação"],
  }
];

// Available filter options
export const filterOptions = {
  platforms: ["WordPress", "Redes Sociais", "Newsletter"],
  articleTypes: ["Notícia", "Reportagem", "Análise", "Entrevista", "Opinião"],
  statuses: ["Publicado", "Rascunho", "Pendente", "Rejeitado"]
};

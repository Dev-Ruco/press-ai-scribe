
import { TranscriptionBlock, ContextSuggestion } from "./types";

export const mockTranscriptionBlocks: TranscriptionBlock[] = [
  {
    id: "1",
    type: "speaker",
    title: "Ministro de Energia",
    items: [
      { text: "Nosso objetivo é alcançar 60% de energia renovável na matriz energética até 2030.", time: "02:15" },
      { text: "Investimentos em energia solar cresceram 45% no último ano.", time: "03:42" }
    ]
  },
  {
    id: "2",
    type: "source",
    title: "Relatório Anual do Setor Energético",
    items: [
      { text: "37% das comunidades rurais ainda não têm acesso à eletricidade.", page: "Pág. 23" },
      { text: "Disparidade de acesso entre áreas urbanas (65%) e rurais (22%).", page: "Pág. 24" }
    ]
  },
  {
    id: "3",
    type: "topic",
    title: "Desafios Identificados",
    items: [
      { text: "Infraestrutura de distribuição deficiente" },
      { text: "Capacitação técnica insuficiente" },
      { text: "Financiamento limitado para projetos de grande escala" }
    ]
  }
];

export const mockContextSuggestions: ContextSuggestion[] = [
  {
    title: "Notícia Relacionada",
    excerpt: "Financiamento de €120 milhões anunciado para expansão da rede elétrica em áreas rurais de Moçambique.",
    source: "Jornal de Negócios, 22/04/2025"
  },
  {
    title: "Estatística Relevante",
    excerpt: "Moçambique possui potencial para produzir 23 GW de energia solar, segundo dados da Agência Internacional de Energia.",
    source: "Relatório IEA, 2024"
  }
];

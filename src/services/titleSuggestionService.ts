
// Armazenamento em memória para os títulos sugeridos (temporário até que os títulos venham da API)
let suggestedTitles: string[] = [];
let subscribers: ((titles: string[]) => void)[] = [];

/**
 * Atualiza os títulos sugeridos com novos valores e notifica os subscribers
 */
export const updateSuggestedTitles = (titles: string[] | string): void => {
  if (typeof titles === 'string') {
    try {
      // Tenta fazer parse se for uma string JSON
      const parsedTitles = JSON.parse(titles);
      suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [titles];
    } catch (e) {
      // Se não for um JSON válido, considera como um único título
      // Se for string, divide por linha
      suggestedTitles = titles.split('\n').filter(t => t.trim() !== '');
    }
  } else if (Array.isArray(titles)) {
    suggestedTitles = titles;
  }
  
  console.log("Títulos atualizados no serviço:", suggestedTitles);
  
  // Notificar todos os subscribers sobre a mudança
  subscribers.forEach(callback => {
    try {
      callback([...suggestedTitles]);
    } catch (err) {
      console.error("Erro ao notificar subscriber sobre novos títulos:", err);
    }
  });
};

/**
 * Retorna os títulos sugeridos atualmente armazenados
 */
export const getSuggestedTitles = (): string[] => {
  return [...suggestedTitles];
};

/**
 * Registra um callback para ser notificado quando títulos forem atualizados
 * Retorna uma função para cancelar a inscrição
 */
export const subscribeTitleUpdates = (callback: (titles: string[]) => void): () => void => {
  subscribers.push(callback);
  
  // Se já tivermos títulos, notifique imediatamente
  if (suggestedTitles.length > 0) {
    try {
      callback([...suggestedTitles]);
    } catch (err) {
      console.error("Erro ao notificar subscriber imediatamente:", err);
    }
  }
  
  // Retorna função para cancelar a inscrição
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
};

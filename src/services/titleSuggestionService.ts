
// Armazenamento em memória para os títulos sugeridos (temporário até que os títulos venham da API)
let suggestedTitles: string[] = [];
let subscribers: ((titles: string[]) => void)[] = [];
let lastUpdateTime: number = 0;

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
  
  // Atualizar timestamp da última modificação
  lastUpdateTime = Date.now();
  
  console.log("Títulos atualizados no serviço:", suggestedTitles, "Timestamp:", new Date(lastUpdateTime).toISOString());
  
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
 * Retorna o timestamp da última atualização de títulos
 */
export const getLastUpdateTime = (): number => {
  return lastUpdateTime;
};

/**
 * Verifica se os títulos foram atualizados desde o timestamp fornecido
 */
export const titlesUpdatedSince = (timestamp: number): boolean => {
  return lastUpdateTime > timestamp;
};

/**
 * Limpa todos os títulos armazenados
 */
export const clearTitles = (): void => {
  suggestedTitles = [];
  lastUpdateTime = Date.now();
  console.log("Títulos limpos no serviço. Timestamp:", new Date(lastUpdateTime).toISOString());
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
      console.log("Notificando novo subscriber imediatamente com títulos existentes:", suggestedTitles);
      callback([...suggestedTitles]);
    } catch (err) {
      console.error("Erro ao notificar subscriber imediatamente:", err);
    }
  } else {
    console.log("Novo subscriber registrado, mas ainda não há títulos para notificar");
  }
  
  // Retorna função para cancelar a inscrição
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
      console.log("Subscriber removido do serviço de títulos");
    }
  };
};

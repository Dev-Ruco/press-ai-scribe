
// Armazenamento em memória para os títulos sugeridos
let suggestedTitles: string[] = [];

/**
 * Atualiza os títulos sugeridos com novos valores
 */
export const updateSuggestedTitles = (titles: string[] | string): void => {
  if (typeof titles === 'string') {
    try {
      // Tenta fazer parse se for uma string JSON
      const parsedTitles = JSON.parse(titles);
      suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [titles];
    } catch (e) {
      // Se não for um JSON válido, considera como um único título
      suggestedTitles = [titles];
    }
  } else if (Array.isArray(titles)) {
    suggestedTitles = titles;
  }
  
  console.log("Títulos atualizados:", suggestedTitles);
};

/**
 * Retorna os títulos sugeridos atualmente armazenados
 */
export const getSuggestedTitles = (): string[] => {
  return [...suggestedTitles];
};

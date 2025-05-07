
// In-memory storage for suggested titles (temporary until titles come from API)
let suggestedTitles: string[] = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

/**
 * Updates the suggested titles with new values
 */
export const updateSuggestedTitles = (titles: string[] | string): void => {
  if (typeof titles === 'string') {
    try {
      // Try to parse if it's a JSON string
      const parsedTitles = JSON.parse(titles);
      suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [titles];
    } catch (e) {
      // If not a valid JSON, consider it as a single title
      // If it's a string, split by line
      suggestedTitles = titles.split('\n').filter(t => t.trim() !== '');
    }
  } else if (Array.isArray(titles)) {
    suggestedTitles = titles;
  }
  
  // Save to localStorage as well for persistence across refreshes
  try {
    localStorage.setItem('suggestedTitles', JSON.stringify(suggestedTitles));
  } catch (e) {
    console.error('Failed to save titles to localStorage:', e);
  }
  
  console.log("Títulos atualizados no serviço:", suggestedTitles);
};

/**
 * Returns the currently stored suggested titles
 */
export const getSuggestedTitles = (): string[] => {
  // Try to load from localStorage first if available
  if (suggestedTitles.length === 0) {
    try {
      const storedTitles = localStorage.getItem('suggestedTitles');
      if (storedTitles) {
        suggestedTitles = JSON.parse(storedTitles);
        console.log("Títulos carregados do localStorage:", suggestedTitles);
      }
    } catch (e) {
      console.error('Failed to load titles from localStorage:', e);
    }
  }
  
  return [...suggestedTitles];
};

// Initialize by trying to load from localStorage when the service is first imported
(function initializeTitles() {
  try {
    const storedTitles = localStorage.getItem('suggestedTitles');
    if (storedTitles) {
      suggestedTitles = JSON.parse(storedTitles);
      console.log("Títulos inicializados do localStorage:", suggestedTitles);
    }
  } catch (e) {
    console.error('Failed to initialize titles from localStorage:', e);
  }
})();

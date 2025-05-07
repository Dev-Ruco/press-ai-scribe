
// In-memory storage for suggested titles (will be synchronized with API when possible)
let suggestedTitles: string[] = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

const LOCAL_STORAGE_KEY = 'suggestedTitles';

/**
 * Updates the suggested titles with new values
 * @param titles Array of titles or string (JSON or newline-separated)
 */
export const updateSuggestedTitles = (titles: string[] | string): void => {
  console.log("Updating suggested titles:", titles);
  
  if (typeof titles === 'string') {
    try {
      // Try to parse if it's a JSON string
      const parsedTitles = JSON.parse(titles);
      suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [titles];
    } catch (e) {
      // If not a valid JSON, consider it as a single title or split by line
      suggestedTitles = titles.split('\n').filter(t => t.trim() !== '');
    }
  } else if (Array.isArray(titles)) {
    suggestedTitles = titles;
  }
  
  // Save to localStorage for persistence across refreshes
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suggestedTitles));
    console.log("Títulos salvos no localStorage:", suggestedTitles);
  } catch (e) {
    console.error('Failed to save titles to localStorage:', e);
  }
  
  console.log("Títulos atualizados no serviço:", suggestedTitles);
};

/**
 * Returns the currently stored suggested titles
 */
export const getSuggestedTitles = (): string[] => {
  // Try to load from localStorage if our in-memory cache is empty
  if (suggestedTitles.length === 0) {
    try {
      const storedTitles = localStorage.getItem(LOCAL_STORAGE_KEY);
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

/**
 * Checks if we have any titles available (either in memory or localStorage)
 */
export const hasTitles = (): boolean => {
  // Check in-memory first
  if (suggestedTitles.length > 0) {
    return true;
  }
  
  // Try localStorage
  try {
    const storedTitles = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTitles !== null && JSON.parse(storedTitles).length > 0;
  } catch (e) {
    return false;
  }
};

// Initialize by trying to load from localStorage when the service is first imported
(function initializeTitles() {
  try {
    const storedTitles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTitles) {
      suggestedTitles = JSON.parse(storedTitles);
      console.log("Títulos inicializados do localStorage:", suggestedTitles);
    }
  } catch (e) {
    console.error('Failed to initialize titles from localStorage:', e);
  }
})();

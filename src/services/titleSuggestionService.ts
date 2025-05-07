
// In-memory storage for suggested titles (will be synchronized with API when possible)
let suggestedTitles: string[] = [
  'Como melhorar sua produtividade no trabalho',
  'Dicas para uma alimentação saudável',
  'Os benefícios da prática regular de exercícios',
  'Estratégias eficazes de gestão de tempo',
  'Tendências tecnológicas para ficar de olho'
];

const LOCAL_STORAGE_KEY = 'suggestedTitles';
const LAST_FETCH_KEY = 'lastTitleFetchTime';
const MIN_FETCH_INTERVAL = 60000; // 1 minute minimum between fetches

/**
 * Updates the suggested titles with new values
 * @param titles Array of titles or string (JSON or newline-separated)
 */
export const updateSuggestionTitles = (titles: string[] | string): void => {
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
    suggestedTitles = titles.filter(t => typeof t === 'string' && t.trim() !== '');
  }
  
  // Save to localStorage for persistence across refreshes
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(suggestedTitles));
    localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
    console.log("Títulos salvos no localStorage:", suggestedTitles);
  } catch (e) {
    console.error('Failed to save titles to localStorage:', e);
  }
  
  console.log("Títulos atualizados no serviço:", suggestedTitles);
};

// Alias for backward compatibility
export const updateSuggestedTitles = updateSuggestionTitles;

/**
 * Returns the currently stored suggested titles
 */
export const getSuggestedTitles = (): string[] => {
  // Try to load from localStorage if our in-memory cache is empty
  if (suggestedTitles.length === 0) {
    try {
      const storedTitles = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTitles) {
        const parsed = JSON.parse(storedTitles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          suggestedTitles = parsed;
          console.log("Títulos carregados do localStorage:", suggestedTitles);
        }
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

/**
 * Checks if we should fetch new titles based on last fetch time
 */
export const shouldFetchTitles = (): boolean => {
  try {
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
    if (!lastFetch) return true;
    
    const timeSinceLastFetch = Date.now() - parseInt(lastFetch);
    return timeSinceLastFetch > MIN_FETCH_INTERVAL;
  } catch (e) {
    return true;
  }
};

/**
 * Marks that we just attempted a fetch, even if it failed
 */
export const markFetchAttempt = (): void => {
  try {
    localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
  } catch (e) {
    console.error('Failed to update last fetch time:', e);
  }
};

// Initialize by trying to load from localStorage when the service is first imported
(function initializeTitles() {
  try {
    const storedTitles = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTitles) {
      const parsed = JSON.parse(storedTitles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        suggestedTitles = parsed;
        console.log("Títulos inicializados do localStorage:", suggestedTitles);
      }
    }
  } catch (e) {
    console.error('Failed to initialize titles from localStorage:', e);
  }
})();

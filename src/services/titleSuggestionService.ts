
// In-memory storage for suggested titles (temporary until titles come from API)
let suggestedTitles: string[] = [];
let subscribers: ((titles: string[], article_id?: string) => void)[] = [];
let lastUpdateTime: number = 0;
let currentArticleId: string | null = null;

/**
 * Updates suggested titles with new values and notifies subscribers
 */
export const updateSuggestedTitles = (titles: string[] | string, article_id?: string): void => {
  if (typeof titles === 'string') {
    try {
      // Try to parse if it's a JSON string
      const parsedTitles = JSON.parse(titles);
      suggestedTitles = Array.isArray(parsedTitles) ? parsedTitles : [titles];
    } catch (e) {
      // If not valid JSON, consider as a single title
      // If string, split by newline
      suggestedTitles = titles.split('\n').filter(t => t.trim() !== '');
    }
  } else if (Array.isArray(titles)) {
    suggestedTitles = titles;
  }
  
  // Update timestamp of last modification
  lastUpdateTime = Date.now();
  
  // Update article_id if provided
  if (article_id) {
    currentArticleId = article_id;
    console.log("Article ID updated:", article_id);
  }
  
  console.log("Titles updated in service:", suggestedTitles, "Timestamp:", new Date(lastUpdateTime).toISOString(), "Article ID:", currentArticleId);
  
  // Notify all subscribers about the change
  subscribers.forEach(callback => {
    try {
      callback([...suggestedTitles], currentArticleId || undefined);
    } catch (err) {
      console.error("Error notifying subscriber about new titles:", err);
    }
  });
};

/**
 * Returns currently stored suggested titles
 */
export const getSuggestedTitles = (): string[] => {
  return [...suggestedTitles];
};

/**
 * Returns the article_id associated with the titles
 */
export const getCurrentArticleId = (): string | null => {
  return currentArticleId;
};

/**
 * Sets the current article_id
 */
export const setCurrentArticleId = (article_id: string): void => {
  if (currentArticleId !== article_id) {
    console.log("Article ID set:", article_id, "(was:", currentArticleId, ")");
    currentArticleId = article_id;
  }
};

/**
 * Returns the timestamp of the last titles update
 */
export const getLastUpdateTime = (): number => {
  return lastUpdateTime;
};

/**
 * Checks if titles were updated since the provided timestamp
 */
export const titlesUpdatedSince = (timestamp: number): boolean => {
  return lastUpdateTime > timestamp;
};

/**
 * Clears all stored titles
 */
export const clearTitles = (): void => {
  suggestedTitles = [];
  lastUpdateTime = Date.now();
  currentArticleId = null;
  console.log("Titles cleared in service. Timestamp:", new Date(lastUpdateTime).toISOString());
};

/**
 * Registers a callback to be notified when titles are updated
 * Returns a function to cancel the subscription
 */
export const subscribeTitleUpdates = (callback: (titles: string[], article_id?: string) => void): () => void => {
  subscribers.push(callback);
  
  // If we already have titles, notify immediately
  if (suggestedTitles.length > 0) {
    try {
      console.log("Notifying new subscriber immediately with existing titles:", suggestedTitles, "Article ID:", currentArticleId);
      callback([...suggestedTitles], currentArticleId || undefined);
    } catch (err) {
      console.error("Error notifying subscriber immediately:", err);
    }
  } else {
    console.log("New subscriber registered, but no titles to notify yet");
  }
  
  // Return function to cancel subscription
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
      console.log("Subscriber removed from title service");
    }
  };
};

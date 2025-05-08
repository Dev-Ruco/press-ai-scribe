
/**
 * Service responsible for making API calls to fetch title suggestions
 */

/**
 * Fetches titles from the Supabase Edge Function
 */
export const fetchTitlesFromApi = async (
  articleId?: string
): Promise<{ titulos: string[]; article_id?: string } | null> => {
  try {
    const now = Date.now();
    
    // Build URL with article_id as parameter if available
    const url = new URL('https://vskzyeurkubazrigfnau.supabase.co/functions/v1/titulos');
    url.searchParams.append('_', now.toString()); // Cache busting
    
    if (articleId) {
      url.searchParams.append('article_id', articleId);
    }
    
    console.log("Fetching titles from API:", url.toString());
    
    // Fetch titles from the Supabase Edge Function
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add anon key for auth
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZza3p5ZXVya3ViYXpyaWdmbmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzU4NTcsImV4cCI6MjA2MDcxMTg1N30.NTvxBgUFHDz0U3xuxUMFSZMRFKrY9K4gASBPF6N-zMc',
        'cache-control': 'no-cache, no-store'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching titles from API:", error);
    throw error;
  }
};

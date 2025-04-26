
export type AuthMethod = 'none' | 'basic' | 'apikey' | 'oauth2' | 'form';

// Modified to ensure type compatibility with Supabase's Json type
export interface SourceAuthConfig {
  method: AuthMethod;
  username?: string;
  password?: string;
  apiKey?: string;
  apiKeyLocation?: 'header' | 'query';
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  tokenUrl?: string;
  loginUrl?: string;
  userSelector?: string;
  passwordSelector?: string;
  loginButtonSelector?: string;
  [key: string]: string | AuthMethod | undefined; // Add index signature for compatibility with Json type
}

export interface NewsArticle {
  title: string;
  content?: string;
  link?: string;
  published_at?: string;
}

export interface NewsSource {
  id?: string;
  name: string;
  url: string;
  category: string;
  frequency: string;
  status?: string;
  auth_config?: SourceAuthConfig | null;
  last_checked_at?: string;
}

export interface WebhookPayload {
  action: 'fetch_latest';
  sourceId: string;
  url: string;
  category: string;
  frequency: string;
}

export interface WebhookResponse {
  articles: NewsArticle[];
}

export type NewsStatsItem = {
  id: string;
  title: string;
  count: number;
  change?: {
    value: string;
    positive: boolean;
  };
};

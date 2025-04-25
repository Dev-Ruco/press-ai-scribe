
export type AuthMethod = 'none' | 'basic' | 'apikey' | 'oauth2' | 'form';

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
}

export interface NewsSource {
  id?: string;
  name: string;
  url: string;
  category: string;
  frequency: string;
  status?: string;
  auth_config?: SourceAuthConfig;
}

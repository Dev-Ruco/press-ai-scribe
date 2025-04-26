
import { z } from 'zod';
import { NewsSource, AuthMethod } from '@/types/news';

export const sourceFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  url: z.string().url({ message: 'URL inválida' }),
  category: z.string().min(1, { message: 'Selecione uma categoria' }),
  frequency: z.string().min(1, { message: 'Selecione uma frequência de monitoramento' }),
  auth_config: z.object({
    method: z.enum(['none', 'basic', 'apikey', 'oauth2', 'form'] as const).default('none'),
    username: z.string().optional(),
    password: z.string().optional(),
    apiKey: z.string().optional(),
    apiKeyLocation: z.enum(['header', 'query']).optional(),
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    authUrl: z.string().url().optional(),
    tokenUrl: z.string().url().optional(),
    loginUrl: z.string().url().optional(),
    userSelector: z.string().optional(),
    passwordSelector: z.string().optional(),
    loginButtonSelector: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.method === 'basic') {
      if (!data.username) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Utilizador é obrigatório para Basic Auth",
          path: ["username"]
        });
      }
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Palavra-passe é obrigatória para Basic Auth",
          path: ["password"]
        });
      }
    }
    if (data.method === 'apikey' && !data.apiKey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Chave de API é obrigatória",
        path: ["apiKey"]
      });
    }
  })
});

export type SourceFormValues = z.infer<typeof sourceFormSchema>;

export interface SourceFormProps {
  source: Partial<NewsSource> | null;
  onCancel: () => void;
  onSave: (source: any) => Promise<any>;
  isSaving?: boolean;
}


import { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { AuthMethod } from '@/types/news';
import { UseFormReturn } from 'react-hook-form';

interface SourceAuthSectionProps {
  form: UseFormReturn<any>;
}

export function SourceAuthSection({ form }: SourceAuthSectionProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('none');

  const handleAuthMethodChange = (value: AuthMethod) => {
    setAuthMethod(value);
    // Reset auth-related fields when changing method
    form.resetField('auth_config.username');
    form.resetField('auth_config.password');
    form.resetField('auth_config.apiKey');
    form.resetField('auth_config.apiKeyLocation');
    form.resetField('auth_config.clientId');
    form.resetField('auth_config.clientSecret');
    form.resetField('auth_config.authUrl');
    form.resetField('auth_config.tokenUrl');
    form.resetField('auth_config.loginUrl');
    form.resetField('auth_config.userSelector');
    form.resetField('auth_config.passwordSelector');
    form.resetField('auth_config.loginButtonSelector');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Autenticação de Fonte Premium</h3>
      
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Para monitorizar conteúdo pago, certifique-se de ter conta premium nesta fonte 
          e forneça as suas credenciais de subscritor. Guardaremos estes dados de forma 
          cifrada e segura.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="auth_config.method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Método de Autenticação</FormLabel>
            <Select 
              onValueChange={(value: AuthMethod) => {
                field.onChange(value);
                handleAuthMethodChange(value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método de autenticação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Nenhum (sites abertos)</SelectItem>
                <SelectItem value="basic">HTTP Basic Auth</SelectItem>
                <SelectItem value="apikey">API Key / Token</SelectItem>
                <SelectItem value="oauth2">OAuth2</SelectItem>
                <SelectItem value="form">Login via Formulário (Paywall)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {authMethod === 'basic' && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="auth_config.username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Utilizador</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-passe</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {authMethod === 'apikey' && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="auth_config.apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chave de API</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.apiKeyLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local de inclusão</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione onde incluir a chave" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="header">Cabeçalho (Header)</SelectItem>
                    <SelectItem value="query">Query Parameter</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {authMethod === 'oauth2' && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="auth_config.clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.authUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorization URL</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.tokenUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token URL</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {authMethod === 'form' && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="auth_config.loginUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de Login</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.userSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seletor CSS do Utilizador</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Ex: #username, .login-input, input[name="user"]
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.passwordSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seletor CSS da Palavra-passe</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auth_config.loginButtonSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seletor CSS do Botão de Login</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {authMethod !== 'none' && (
        <p className="text-sm text-muted-foreground mt-4">
          As suas credenciais serão cifradas no servidor e nunca expostas em logs ou código.
        </p>
      )}
    </div>
  );
}

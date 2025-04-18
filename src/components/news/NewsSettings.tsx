
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const NewsSettings = () => {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Alertas de novas notícias</div>
              <div className="text-sm text-text-secondary">Receba notificações quando novas notícias forem publicadas</div>
            </div>
            <Switch defaultChecked id="notifications-switch" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Alertas por e-mail</div>
              <div className="text-sm text-text-secondary">Receba um resumo diário das notícias mais importantes</div>
            </div>
            <Switch id="email-alerts-switch" />
          </div>
        </CardContent>
      </Card>
      
      {/* Sources Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Fontes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Atualização automática</div>
              <div className="text-sm text-text-secondary">Verificar novas notícias automaticamente</div>
            </div>
            <Switch defaultChecked id="auto-update-switch" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Formato padrão</div>
              <div className="text-sm text-text-secondary">Formato preferencial para novas fontes</div>
            </div>
            <Select defaultValue="rss">
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rss">RSS</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Languages Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Idiomas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Idioma principal</div>
              <div className="text-sm text-text-secondary">Idioma preferencial para exibição</div>
            </div>
            <Select defaultValue="pt">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Tradução automática</div>
              <div className="text-sm text-text-secondary">Traduzir conteúdo para o idioma principal</div>
            </div>
            <Switch id="auto-translate-switch" />
          </div>
        </CardContent>
      </Card>
      
      {/* Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Período de retenção</div>
              <div className="text-sm text-text-secondary">Por quanto tempo manter as notícias</div>
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Limpar cache</div>
              <div className="text-sm text-text-secondary">Remover dados temporários de notícias</div>
            </div>
            <Button variant="outline" size="sm">
              Limpar agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

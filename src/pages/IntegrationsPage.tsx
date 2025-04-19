
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const platforms = [
  {
    name: "WordPress",
    description: "Publique artigos diretamente no seu blog WordPress",
    connected: true
  },
  {
    name: "Medium",
    description: "Compartilhe seus artigos na plataforma Medium",
    connected: false
  },
  {
    name: "LinkedIn",
    description: "Publique artigos como posts no LinkedIn",
    connected: true
  },
  {
    name: "Ghost",
    description: "Integre com sua publicação no Ghost CMS",
    connected: false
  }
];

export default function IntegrationsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte o Press AI com suas plataformas de publicação preferidas
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Personalizado</CardTitle>
              <CardDescription>
                Configure um webhook para integrar com qualquer plataforma externa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="https://sua-api.com/webhook"
                  className="flex-1"
                />
                <Button>Salvar Webhook</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plataformas Disponíveis</CardTitle>
              <CardDescription>
                Gerencie suas conexões com plataformas de publicação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {platforms.map((platform, index) => (
                <div key={platform.name}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                    </div>
                    <Button variant={platform.connected ? "outline" : "default"}>
                      {platform.connected ? "Configurar" : "Conectar"}
                    </Button>
                  </div>
                  {index < platforms.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

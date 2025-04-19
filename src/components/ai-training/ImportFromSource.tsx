
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Link2, Database, Rss, Globe, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImportFromSource() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  
  const handleImport = () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um URL válido",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Importação Iniciada",
      description: "A fonte está sendo processada para treino da IA.",
    });
    
    // Reset the field after successful submission
    setUrl("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Importação Automática de Conteúdo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="wordpress" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="wordpress" className="gap-2">
              <Database className="h-4 w-4" />
              WordPress API
            </TabsTrigger>
            <TabsTrigger value="rss" className="gap-2">
              <Rss className="h-4 w-4" />
              Feed RSS
            </TabsTrigger>
            <TabsTrigger value="html" className="gap-2">
              <Globe className="h-4 w-4" />
              URL/HTML
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wordpress" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="wp-url" className="block text-sm font-medium mb-1">URL do Site</label>
                  <Input 
                    id="wp-url" 
                    placeholder="https://seusite.com" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="wp-key" className="block text-sm font-medium mb-1">Chave API (opcional)</label>
                  <Input id="wp-key" type="password" placeholder="Chave de acesso" />
                </div>
              </div>
              
              <div>
                <label htmlFor="wp-endpoint" className="block text-sm font-medium mb-1">Endpoint</label>
                <div className="flex gap-2">
                  <Input 
                    id="wp-endpoint" 
                    defaultValue="/wp-json/wp/v2/posts" 
                    className="flex-1" 
                  />
                  <Button 
                    onClick={handleImport}
                    className="gap-2"
                  >
                    Importar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rss" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="rss-url" className="block text-sm font-medium mb-1">URL do Feed RSS</label>
                <div className="flex gap-2">
                  <Input 
                    id="rss-url" 
                    placeholder="https://seusite.com/feed" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleImport}
                    className="gap-2"
                  >
                    Importar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="html-url" className="block text-sm font-medium mb-1">URL da Página</label>
                <div className="flex gap-2">
                  <Input 
                    id="html-url" 
                    placeholder="https://seusite.com/pagina" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleImport}
                    className="gap-2"
                  >
                    Importar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/30 rounded-md p-4">
          <h4 className="font-medium mb-2">Fontes Recentes</h4>
          <ul className="space-y-2">
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <span>publico.pt/wp-json/wp/v2/posts</span>
              </div>
              <span className="text-xs text-muted-foreground">12 artigos</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Rss className="h-4 w-4 text-primary" />
                <span>observador.pt/feed</span>
              </div>
              <span className="text-xs text-muted-foreground">47 artigos</span>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>expresso.pt/sociedade</span>
              </div>
              <span className="text-xs text-muted-foreground">8 artigos</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

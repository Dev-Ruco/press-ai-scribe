
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FilePlus, Paperclip, Globe, Lightbulb, Mic, FileText, Link, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateArticlePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <FilePlus size={24} className="text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                Criar Novo Artigo
              </h1>
            </div>
            <p className="mt-2 text-muted-foreground">
              Crie seu artigo com assistência de IA
            </p>
          </div>

          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Smart Input Area */}
            <Card className="border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Input 
                    type="text"
                    placeholder="Pergunte qualquer coisa"
                    className="flex-grow bg-background text-foreground"
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Paperclip size={14} />
                      <span>Anexar</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Globe size={14} />
                      <span>Procurar</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Lightbulb size={14} />
                      <span>Raciocinar</span>
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Mic size={14} />
                      <span>Voz</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Preview Area */}
            <Card className="border-border/30">
              <CardContent className="p-6 min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Aguardando entrada ou transcrição...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <Card className="w-full md:w-[280px] border-border/30 shadow-sm bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <CardContent className="p-4 space-y-6">
            {/* Preview Section */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Pré-visualização</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>[00:00] Introdução ao tema do artigo...</p>
                <p>[00:15] Comentários do entrevistado sobre...</p>
                <p>[00:35] Factos complementares adicionados pela IA...</p>
              </div>
            </div>

            <Separator />

            {/* Attached Sources */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Fontes anexadas</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText size={16} />
                  <span>Documento.docx</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link size={16} />
                  <span>www.exemplo.com</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image size={16} />
                  <span>imagem.jpg</span>
                </li>
              </ul>
            </div>

            <Separator />

            {/* AI Suggestions */}
            <div>
              <h3 className="font-medium mb-3 text-sm">Sugestões da IA</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Título sugerido: "Impacto da Nova Política Fiscal"</li>
                <li>• Lead: "Moçambique revê prioridades para 2025..."</li>
                <li>• Tom: Informativo / Institucional</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

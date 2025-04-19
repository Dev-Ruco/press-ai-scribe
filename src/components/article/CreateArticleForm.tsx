
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Link2, Upload } from "lucide-react";

export function CreateArticleForm() {
  const [step, setStep] = useState(1);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Upload de Arquivo</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-text-secondary" />
                    <p className="text-sm text-text-secondary">
                      Arraste arquivos ou clique para fazer upload
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Suporta áudio, vídeo, texto ou PDF
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Link</label>
                  <div className="relative">
                    <Input
                      placeholder="Cole o link do YouTube, TikTok, etc."
                      className="pl-10"
                    />
                    <Link2 className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Conteúdo</label>
                  <Textarea
                    placeholder="Digite ou cole o conteúdo aqui"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Tipo de Artigo
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">Notícia</SelectItem>
                        <SelectItem value="opinion">Op-Ed</SelectItem>
                        <SelectItem value="interview">Entrevista</SelectItem>
                        <SelectItem value="chronicle">Crônica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Idioma
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-mz">Português (Moçambique)</SelectItem>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en">Inglês</SelectItem>
                        <SelectItem value="fr">Francês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Padrão Ortográfico
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o padrão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre1990">Pré-1990</SelectItem>
                        <SelectItem value="post1990">Pós-1990</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Tom do Artigo
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tom" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutro</SelectItem>
                        <SelectItem value="analytical">Analítico</SelectItem>
                        <SelectItem value="creative">Criativo</SelectItem>
                        <SelectItem value="journalistic">Jornalístico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>
                  Próximo
                  <FileText className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Processamento de IA
              </h3>
              <p className="text-text-secondary">
                O conteúdo será processado aqui após a conclusão da etapa anterior.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

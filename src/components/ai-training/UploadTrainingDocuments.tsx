
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileJson, Upload, Check, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UploadTrainingDocuments() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, type: string, size: string}>>([
    { name: "guia_estilo_editorial.docx", type: "docx", size: "245 KB" },
    { name: "dados_demograficos_2025.pdf", type: "pdf", size: "1.2 MB" },
    { name: "artigos_referencia.txt", type: "txt", size: "78 KB" }
  ]);

  const handleFileUpload = () => {
    toast({
      title: "Upload Simulado",
      description: "Ficheiros recebidos com sucesso para treino da IA.",
      duration: 3000,
    });
    
    // Simulate a new file upload
    const newFile = { 
      name: `novo_documento_${Math.floor(Math.random() * 1000)}.pdf`, 
      type: "pdf", 
      size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB` 
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Documentos para Treino</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/40 border border-dashed border-border rounded-lg flex flex-col items-center justify-center py-10 px-4">
          <div className="bg-primary/10 rounded-full p-3 mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Arraste ficheiros ou clique para upload</h3>
          <p className="text-muted-foreground text-sm text-center mb-4">
            Suportamos .txt, .docx, .pdf, e .json até 10MB
          </p>
          <Button onClick={handleFileUpload} className="gap-2">
            <Upload className="h-4 w-4" />
            Selecionar Ficheiros
          </Button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Ficheiros Carregados</h4>
            <div className="border rounded-md divide-y">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    {file.type === "pdf" ? (
                      <FileText className="h-5 w-5 text-red-500" />
                    ) : file.type === "json" ? (
                      <FileJson className="h-5 w-5 text-amber-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Remover</Button>
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Brain className="h-4 w-4" />
                Processar Ficheiros
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

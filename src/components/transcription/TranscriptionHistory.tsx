
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, RotateCw, File, Upload } from "lucide-react";
import { Link } from "react-router-dom";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

interface TranscriptionHistoryProps {
  transcriptions: Transcription[];
  isLoading?: boolean;
}

export function TranscriptionHistory({ transcriptions, isLoading = false }: TranscriptionHistoryProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando transcrições...</p>
      </div>
    );
  }

  if (transcriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <File className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <p className="text-lg font-medium mb-2">Sem transcrições</p>
        <p className="text-muted-foreground mb-6">Você ainda não possui transcrições.</p>
        <Button asChild>
          <Link to="/transcribe">
            <Upload className="mr-2 h-4 w-4" />
            Fazer uma transcrição
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Arquivo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transcriptions.map((transcription) => (
            <TableRow key={transcription.id} className="hover:bg-primary/5">
              <TableCell className="font-medium">{transcription.name}</TableCell>
              <TableCell>{transcription.date}</TableCell>
              <TableCell>{transcription.duration}</TableCell>
              <TableCell>
                <span className={
                  transcription.status === 'completed' ? "text-success bg-success/10 px-2 py-1 rounded-full text-xs" :
                  transcription.status === 'processing' ? "text-muted-foreground bg-muted/50 px-2 py-1 rounded-full text-xs" :
                  "text-destructive bg-destructive/10 px-2 py-1 rounded-full text-xs"
                }>
                  {transcription.status === 'completed' ? 'Concluído' : 
                   transcription.status === 'processing' ? 'Processando' : 'Falhou'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {transcription.status === 'completed' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {transcription.status === 'failed' && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

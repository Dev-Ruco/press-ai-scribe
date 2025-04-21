
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2, RotateCw, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

interface TranscriptionHistoryProps {
  transcriptions: Transcription[];
}

export function TranscriptionHistory({ transcriptions }: TranscriptionHistoryProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-4">Faça login para ver seu histórico de transcrições.</p>
        <Button asChild>
          <a href="/auth" className="gap-2">
            Entrar na sua conta
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }
  
  if (transcriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Você ainda não possui transcrições.</p>
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

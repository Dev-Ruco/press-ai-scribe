
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download, Edit, Trash2, Headphones } from "lucide-react";

interface Transcription {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

interface TranscriptionTableProps {
  transcriptions: Transcription[];
}

export function TranscriptionTable({ transcriptions }: TranscriptionTableProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-white">
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="font-medium text-lg">Transcrições Recentes</h2>
        <Button variant="ghost" className="text-primary gap-2">
          <Headphones size={16} />
          <span>Transcrever Arquivo</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
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
              <TableRow key={transcription.id}>
                <TableCell className="font-medium">{transcription.name}</TableCell>
                <TableCell>{transcription.date}</TableCell>
                <TableCell>{transcription.duration}</TableCell>
                <TableCell>
                  <span className={
                    transcription.status === 'completed' ? "text-success bg-success/10 px-2 py-1 rounded-full text-xs" :
                    transcription.status === 'processing' ? "text-primary bg-primary/10 px-2 py-1 rounded-full text-xs" :
                    "text-error bg-error/10 px-2 py-1 rounded-full text-xs"
                  }>
                    {transcription.status === 'completed' ? 'Concluído' : 
                     transcription.status === 'processing' ? 'Processando' : 'Falhou'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Download size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

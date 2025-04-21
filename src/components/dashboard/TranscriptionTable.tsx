
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p>Faça login para ver suas transcrições.</p>
        <Button 
          variant="outline" 
          className="mt-4 border-neutral-300 hover:bg-neutral-100" 
          onClick={() => navigate('/auth')}
        >
          Entrar na sua conta
        </Button>
      </div>
    );
  }

  if (transcriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">Você ainda não possui transcrições.</p>
      </div>
    );
  }
  
  return (
    <>
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">Transcrições</h2>
      <Separator className="bg-neutral-200 mb-6" />
      
      <div className="rounded-md border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-100">
            <TableRow className="hover:bg-neutral-100">
              <TableHead className="font-medium text-neutral-700">Nome do Arquivo</TableHead>
              <TableHead className="font-medium text-neutral-700">Data</TableHead>
              <TableHead className="font-medium text-neutral-700">Duração</TableHead>
              <TableHead className="font-medium text-neutral-700">Status</TableHead>
              <TableHead className="text-right font-medium text-neutral-700">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transcriptions.map((transcription) => (
              <TableRow key={transcription.id} className="hover:bg-neutral-50 border-neutral-200">
                <TableCell className="font-medium text-base py-4">{transcription.name}</TableCell>
                <TableCell className="text-base py-4">{transcription.date}</TableCell>
                <TableCell className="text-base py-4">{transcription.duration}</TableCell>
                <TableCell className="py-4">
                  <span className={
                    transcription.status === 'completed' ? "text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm" :
                    transcription.status === 'processing' ? "text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full text-sm" :
                    "text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm"
                  }>
                    {transcription.status === 'completed' ? 'Concluído' : 
                     transcription.status === 'processing' ? 'Processando' : 'Falhou'}
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    {transcription.status === 'completed' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 h-10 w-10"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 h-10 w-10"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-neutral-500 hover:text-red-600 hover:bg-red-50 h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

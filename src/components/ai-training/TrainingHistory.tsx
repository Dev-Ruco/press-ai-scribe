
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, History, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TrainingRecord {
  id: string;
  date: string;
  type: string;
  source: string;
  documents: number;
  tokens: number;
  status: "success" | "processing" | "failed";
}

export function TrainingHistory() {
  // Mock data for training history
  const records: TrainingRecord[] = [
    {
      id: "1",
      date: "18/04/2025",
      type: "Upload Manual",
      source: "Relatório Anual 2024",
      documents: 3,
      tokens: 45832,
      status: "success"
    },
    {
      id: "2",
      date: "15/04/2025",
      type: "WordPress API",
      source: "publico.pt",
      documents: 27,
      tokens: 238754,
      status: "success"
    },
    {
      id: "3",
      date: "12/04/2025",
      type: "Feed RSS",
      source: "lusa.pt",
      documents: 42,
      tokens: 108321,
      status: "processing"
    },
    {
      id: "4",
      date: "10/04/2025",
      type: "URL/HTML",
      source: "dn.pt/economia",
      documents: 15,
      tokens: 76190,
      status: "failed"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Treino da IA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar no histórico..."
                className="pl-8"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead className="text-right">Documentos</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="hover:bg-primary/5">
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.source}</TableCell>
                    <TableCell className="text-right">{record.documents}</TableCell>
                    <TableCell className="text-right">{record.tokens.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "success"
                            ? "bg-primary/10 text-primary"
                            : record.status === "processing"
                            ? "bg-muted/50 text-muted-foreground"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {record.status === "success"
                          ? "Concluído"
                          : record.status === "processing"
                          ? "Processando"
                          : "Falhou"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <History className="h-4 w-4" />
              <span>Apenas os últimos 30 dias são exibidos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

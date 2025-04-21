
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
import { Download, History, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export function TrainingHistory() {
  const { user } = useAuth();
  
  // Sem dados simulados para usuários não logados
  const records = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Treino da IA</CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">Faça login para ver seu histórico de treino da IA.</p>
            <Button asChild>
              <a href="/auth" className="gap-2">
                Entrar na sua conta
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
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

            {records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum histórico de treino encontrado.</p>
                <p className="text-sm mt-2">Adicione documentos ao treino da IA para começar!</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

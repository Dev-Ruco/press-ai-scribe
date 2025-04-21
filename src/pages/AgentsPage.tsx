
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { PlusCircle, Bot, Settings, Play, Pause, Trash2, Edit, Microscope, BookA, Globe, Share } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AgentsPage() {
  const { toast } = useToast();
  const { current } = useWorkspace();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Dados simulados para demonstração
  const [agents, setAgents] = useState([
    {
      id: '1',
      name: 'Revisor Editorial',
      type: 'revision',
      description: 'Revisa artigos seguindo o estilo editorial da redação',
      status: 'active',
      icon: <Microscope size={18} />,
      lastRun: '2025-04-20 14:30',
      stats: { processed: 32, successful: 30, failed: 2 }
    },
    {
      id: '2',
      name: 'Curador de Conteúdo',
      type: 'curation',
      description: 'Pesquisa tópicos relevantes e gera sugestões de conteúdo',
      status: 'inactive',
      icon: <BookA size={18} />,
      lastRun: '2025-04-19 09:15',
      stats: { processed: 24, successful: 22, failed: 2 }
    },
    {
      id: '3',
      name: 'Otimizador de SEO',
      type: 'seo',
      description: 'Analisa e otimiza conteúdo para melhor posicionamento em buscas',
      status: 'active',
      icon: <Globe size={18} />,
      lastRun: '2025-04-20 11:45',
      stats: { processed: 18, successful: 18, failed: 0 }
    },
    {
      id: '4',
      name: 'Distribuidor de Conteúdo',
      type: 'distribution',
      description: 'Publica automaticamente conteúdo em diferentes plataformas',
      status: 'inactive',
      icon: <Share size={18} />,
      lastRun: 'Nunca executado',
      stats: { processed: 0, successful: 0, failed: 0 }
    }
  ]);
  
  // Formulário para novo agente
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'revision',
    description: ''
  });
  
  const handleCreateAgent = () => {
    // Aqui seria feita a chamada à API para criar o agente
    const agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      type: newAgent.type,
      description: newAgent.description,
      status: 'inactive',
      icon: <Bot size={18} />,
      lastRun: 'Nunca executado',
      stats: { processed: 0, successful: 0, failed: 0 }
    };
    
    setAgents([...agents, agent]);
    setOpenDialog(false);
    setNewAgent({ name: '', type: 'revision', description: '' });
    
    toast({
      title: "Agente criado com sucesso",
      description: "O novo agente foi adicionado à sua redação"
    });
  };
  
  const toggleAgentStatus = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'active' ? 'inactive' : 'active';
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
    
    toast({
      title: "Status atualizado",
      description: "O status do agente foi alterado com sucesso"
    });
  };
  
  const deleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
    
    toast({
      title: "Agente removido",
      description: "O agente foi removido com sucesso da sua redação"
    });
  };

  // Verifica se está em uma organização
  if (current.type !== 'organisation') {
    return (
      <MainLayout>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Configuração de Agentes</CardTitle>
            <CardDescription>
              Esta funcionalidade está disponível apenas para redações.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Para configurar agentes inteligentes, você precisa estar em uma redação.
            </p>
            <Button onClick={() => window.history.back()}>Voltar</Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agentes da Redação</h1>
            <p className="text-muted-foreground">
              Gerencie os agentes inteligentes que automatizam tarefas na sua redação.
            </p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle size={16} />
                <span>Novo Agente</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Agente</DialogTitle>
                <DialogDescription>
                  Configure um novo agente inteligente para sua redação.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nome do Agente</label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Revisor de Conteúdo"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Tipo</label>
                  <Select 
                    value={newAgent.type}
                    onValueChange={(value) => setNewAgent({...newAgent, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revision">Revisão</SelectItem>
                      <SelectItem value="curation">Curadoria</SelectItem>
                      <SelectItem value="seo">SEO</SelectItem>
                      <SelectItem value="distribution">Distribuição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Descrição</label>
                  <Textarea 
                    id="description" 
                    placeholder="Descreva o que este agente fará..."
                    value={newAgent.description}
                    onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button onClick={handleCreateAgent}>Criar Agente</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-md">Total de Agentes</CardTitle>
                  <CardDescription>Agentes configurados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Play className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-md">Agentes Ativos</CardTitle>
                  <CardDescription>Em execução</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {agents.filter(a => a.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-full">
                  <Pause className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-md">Agentes Inativos</CardTitle>
                  <CardDescription>Pausados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {agents.filter(a => a.status === 'inactive').length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agentes</CardTitle>
            <CardDescription>
              Gerencie os agentes da sua redação, ative, desative ou remova conforme necessário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Última Execução</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {agent.icon}
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {agent.description}
                    </TableCell>
                    <TableCell>{agent.lastRun}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        <span className={
                          agent.status === 'active' ? 'text-green-500' : 'text-amber-500'
                        }>
                          {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toggleAgentStatus(agent.id)}
                          title={agent.status === 'active' ? 'Desativar' : 'Ativar'}
                        >
                          {agent.status === 'active' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Configurar"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => deleteAgent(agent.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {agents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Nenhum agente configurado ainda.
                      </p>
                      <Button 
                        className="mt-4" 
                        variant="outline"
                        onClick={() => setOpenDialog(true)}
                      >
                        Criar Primeiro Agente
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

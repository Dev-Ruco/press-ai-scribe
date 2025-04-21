
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, UserPlus } from "lucide-react";

interface Member {
  email: string;
  role: string;
}

interface NewsroomTeamMembersProps {
  members: Member[];
  onChange: (members: Member[]) => void;
}

export function NewsroomTeamMembers({ members, onChange }: NewsroomTeamMembersProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("journalist");
  const { toast } = useToast();

  const handleAddMember = () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Digite o email do membro da equipe.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar se o email já existe
    if (members.some(member => member.email === email)) {
      toast({
        title: "Membro já adicionado",
        description: "Este email já foi adicionado à equipe.",
        variant: "destructive"
      });
      return;
    }
    
    const newMember = { email, role };
    onChange([...members, newMember]);
    setEmail("");
  };
  
  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    onChange(updatedMembers);
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const roles = [
    { value: "editor_chefe", label: "Editor-Chefe" },
    { value: "editor", label: "Editor" },
    { value: "journalist", label: "Jornalista" },
    { value: "revisor", label: "Revisor" },
    { value: "fotojornalista", label: "Fotojornalista" },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="bg-muted/40 p-6 rounded-md border">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Membros à Equipe</span>
          </h3>
          
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input 
                placeholder="Email do membro" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-44">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddMember} className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </Button>
          </div>
          
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum membro adicionado ainda.</p>
              <p className="text-sm">Adicione membros à sua equipe editorial.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2">Membros adicionados</h4>
              <div className="border rounded-md divide-y">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {roles.find(r => r.value === member.role)?.label || member.role}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveMember(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

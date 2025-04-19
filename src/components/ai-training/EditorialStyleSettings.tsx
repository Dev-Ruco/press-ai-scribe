
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StyleProfile {
  id: string;
  name: string;
  type: string;
  tone: string;
  language: string;
  guidelines: string;
}

export function EditorialStyleSettings() {
  const { toast } = useToast();

  const [styleProfiles, setStyleProfiles] = useState<StyleProfile[]>([
    {
      id: "1",
      name: "Notícias Diárias",
      type: "noticia",
      tone: "objetivo",
      language: "formal",
      guidelines: "Foco em factos e citações diretas. Evitar adjetivação excessiva. Parágrafos curtos com informação concisa."
    },
    {
      id: "2",
      name: "Editorial de Opinião",
      type: "opiniao",
      tone: "persuasivo",
      language: "formal",
      guidelines: "Análise profunda com argumentos bem sustentados. Referências a fontes e especialistas. Tom mais reflexivo."
    },
    {
      id: "3",
      name: "Reportagem Especial",
      type: "reportagem",
      tone: "narrativo",
      language: "semi-formal",
      guidelines: "Abordagem mais literária. Descrições detalhadas de cenários e personagens. Uso de elementos narrativos."
    }
  ]);

  const [newProfile, setNewProfile] = useState<Omit<StyleProfile, "id">>({
    name: "",
    type: "noticia",
    tone: "objetivo",
    language: "formal",
    guidelines: ""
  });

  const handleSaveProfile = () => {
    if (!newProfile.name || !newProfile.guidelines) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newId = String(Date.now());
    setStyleProfiles(prev => [...prev, { ...newProfile, id: newId }]);
    
    // Reset form
    setNewProfile({
      name: "",
      type: "noticia",
      tone: "objetivo",
      language: "formal",
      guidelines: ""
    });

    toast({
      title: "Perfil Criado",
      description: "O novo perfil de estilo foi adicionado com sucesso",
    });
  };

  const handleDeleteProfile = (id: string) => {
    setStyleProfiles(prev => prev.filter(profile => profile.id !== id));
    toast({
      title: "Perfil Removido",
      description: "O perfil de estilo foi excluído com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Estilo Editorial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-medium">Novo Perfil de Estilo</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium">Nome do Perfil</label>
              <Input 
                id="profile-name" 
                placeholder="Ex: Notícias Diárias" 
                value={newProfile.name}
                onChange={(e) => setNewProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-type" className="text-sm font-medium">Tipo de Artigo</label>
              <Select 
                value={newProfile.type} 
                onValueChange={(value) => setNewProfile(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="profile-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noticia">Notícia</SelectItem>
                  <SelectItem value="opiniao">Opinião</SelectItem>
                  <SelectItem value="reportagem">Reportagem</SelectItem>
                  <SelectItem value="entrevista">Entrevista</SelectItem>
                  <SelectItem value="analise">Análise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-tone" className="text-sm font-medium">Tom</label>
              <Select 
                value={newProfile.tone} 
                onValueChange={(value) => setNewProfile(prev => ({ ...prev, tone: value }))}
              >
                <SelectTrigger id="profile-tone">
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="objetivo">Objetivo</SelectItem>
                  <SelectItem value="persuasivo">Persuasivo</SelectItem>
                  <SelectItem value="informativo">Informativo</SelectItem>
                  <SelectItem value="narrativo">Narrativo</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-language" className="text-sm font-medium">Linguagem</label>
              <Select 
                value={newProfile.language} 
                onValueChange={(value) => setNewProfile(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger id="profile-language">
                  <SelectValue placeholder="Selecione a linguagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="academico">Académico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-guidelines" className="text-sm font-medium">Diretrizes de Redação</label>
            <Textarea 
              id="profile-guidelines" 
              placeholder="Insira diretrizes específicas para este perfil de estilo"
              value={newProfile.guidelines}
              onChange={(e) => setNewProfile(prev => ({ ...prev, guidelines: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar Perfil
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Perfis de Estilo Existentes</h3>
          
          <div className="space-y-4">
            {styleProfiles.map(profile => (
              <Card key={profile.id} className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{profile.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Tom: {profile.tone}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {profile.language}
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {profile.guidelines}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteProfile(profile.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

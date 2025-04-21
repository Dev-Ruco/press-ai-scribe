import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Newspaper, Upload, Users, Brain, LibrarySquare, Bot } from "lucide-react";
import { NewsroomLogoUpload } from "@/components/newsroom/NewsroomLogoUpload";
import { NewsroomTeamMembers } from "@/components/newsroom/NewsroomTeamMembers";
import { NewsroomAITraining } from "@/components/newsroom/NewsroomAITraining";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractColorsFromImage } from "@/lib/colorExtractor";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome da redação deve ter pelo menos 2 caracteres" }),
  description: z.string().optional(),
  editorial: z.string().optional(),
  logoUrl: z.string().min(1, { message: "Por favor, carregue um logotipo" }),
  enableAgents: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateNewsroomPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshOrganisations, switchToOrganisation } = useWorkspace();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState<{primary: string, secondary: string, accent: string} | null>(null);
  const [teamMembers, setTeamMembers] = useState<{email: string, role: string}[]>([]);
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [trainingUrls, setTrainingUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      editorial: "",
      logoUrl: "",
      enableAgents: true
    }
  });

  const onLogoUpload = async (url: string) => {
    form.setValue("logoUrl", url);
    try {
      // Extrair cores do logotipo
      const extractedColors = await extractColorsFromImage(url);
      setColors(extractedColors);
      toast({
        title: "Cores extraídas com sucesso",
        description: "O tema da sua redação foi personalizado com base no logotipo.",
      });
    } catch (error) {
      console.error("Erro ao extrair cores:", error);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUserId) {
        throw new Error("Usuário não autenticado");
      }
      
      // 1. Criar a organização (redação)
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .insert([
          { 
            name: data.name, 
            created_by: currentUserId
          }
        ])
        .select("id, name")
        .single();

      if (orgError) throw orgError;
      
      // 2. Criar estilo da organização com base nas cores extraídas
      if (orgData.id && colors) {
        const { error: styleError } = await supabase
          .from("organisation_styles")
          .insert([
            { 
              organisation_id: orgData.id,
              name: `${data.name} Style`,
              style_guidelines: data.editorial || "",
              reference_docs: {
                primary_color: colors.primary,
                secondary_color: colors.secondary,
                accent_color: colors.accent,
                logo_url: data.logoUrl
              }
            }
          ]);

        if (styleError) throw styleError;
      }

      // 3. Adicionar o criador como membro da organização (admin)
      const { error: memberError } = await supabase
        .from("organisation_members")
        .insert([
          { 
            organisation_id: orgData.id,
            user_id: currentUserId,
            role: "admin",  // Usuário é automaticamente admin
            status: "accepted"
          }
        ]);

      if (memberError) throw memberError;
      
      // 4. Enviar convites para membros da equipe
      for (const member of teamMembers) {
        // Na prática, aqui seria enviado um email de convite
        // Para este exemplo, apenas registramos o membro com status "pending"
        const { error: inviteError } = await supabase
          .from("organisation_members")
          .insert([
            { 
              organisation_id: orgData.id,
              user_id: member.email, // Na prática, precisariamos vincular ao ID do usuário
              role: member.role,
              status: "pending"
            }
          ]);
        
        if (inviteError) console.error("Erro ao convidar membro:", inviteError);
      }

      // 5. Processar arquivos de treino da IA (simulação)
      // Na prática, os arquivos seriam enviados para processamento
      console.log("Arquivos para treino:", trainingFiles);
      console.log("URLs para treino:", trainingUrls);

      // 6. Configurar opção de agentes, se habilitada
      if (data.enableAgents) {
        // Aqui adicionaríamos a configuração de agentes
        console.log("Agentes habilitados para esta redação");
      }
      
      // Atualizar a lista de organizações
      await refreshOrganisations();
      
      toast({
        title: "Redação criada com sucesso!",
        description: "A sua redação foi configurada e já está pronta para uso."
      });

      // Alternar automaticamente para a nova redação
      switchToOrganisation({
        id: orgData.id,
        name: orgData.name,
        role: "admin",
        logoUrl: data.logoUrl,
        primaryColor: colors?.primary
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao criar redação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Nova Redação</h1>
          <p className="text-muted-foreground">
            Configure sua redação personalizada e comece a gerenciar seu conteúdo editorial.
          </p>
        </div>

        <Card className={colors ? `border-t-4 border-t-[${colors.primary}]` : ''}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4" />
                    <span>Informações Básicas</span>
                  </TabsTrigger>
                  <TabsTrigger value="branding" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Identidade Visual</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Equipe</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Treino da IA</span>
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span>Agentes</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <CardHeader>
                    <CardTitle>Informações da Redação</CardTitle>
                    <CardDescription>
                      Defina o nome e outras informações básicas sobre sua redação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Redação</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Jornal da Cidade" {...field} />
                          </FormControl>
                          <FormDescription>
                            Este será o nome oficial da sua redação.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva o propósito e foco da sua redação" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate("/")}>Cancelar</Button>
                    <Button type="button" onClick={() => setActiveTab("branding")}>Próximo</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="branding">
                  <CardHeader>
                    <CardTitle>Identidade Visual</CardTitle>
                    <CardDescription>
                      Faça upload do logotipo da sua redação e defina sua linha editorial.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Logotipo da Redação</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Faça upload do logotipo oficial da sua redação. As cores do site serão automaticamente adaptadas com base nessa imagem.
                        </p>
                        
                        <NewsroomLogoUpload 
                          onUploadComplete={onLogoUpload} 
                        />
                        
                        {colors && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-md">
                            <h4 className="font-medium mb-2">Cores Extraídas</h4>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-12 h-12 rounded-md shadow-sm" 
                                  style={{ backgroundColor: colors.primary }}
                                />
                                <span className="text-xs mt-1">Primária</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-12 h-12 rounded-md shadow-sm" 
                                  style={{ backgroundColor: colors.secondary }}
                                />
                                <span className="text-xs mt-1">Secundária</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-12 h-12 rounded-md shadow-sm" 
                                  style={{ backgroundColor: colors.accent }}
                                />
                                <span className="text-xs mt-1">Destaque</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="editorial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Linha Editorial</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva a linha editorial, valores e diretrizes de conteúdo da sua redação" 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <h3 className="font-medium mb-2">Documentos de Estilo</h3>
                        <div className="bg-muted/40 border border-dashed border-border rounded-lg flex flex-col items-center justify-center py-10 px-4">
                          <div className="bg-primary/10 rounded-full p-3 mb-4">
                            <LibrarySquare className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="text-lg font-medium mb-1">Upload de Documentos de Estilo</h4>
                          <p className="text-muted-foreground text-sm text-center mb-4">
                            Carregue manuais de redação, diretrizes editoriais e outros documentos de referência.
                          </p>
                          <Button variant="outline" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Selecionar Documentos
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("basic")}>Voltar</Button>
                    <Button type="button" onClick={() => setActiveTab("team")}>Próximo</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="team">
                  <CardHeader>
                    <CardTitle>Equipe Editorial</CardTitle>
                    <CardDescription>
                      Adicione membros à sua equipe de redação e defina suas funções.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NewsroomTeamMembers
                      members={teamMembers}
                      onChange={setTeamMembers}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("branding")}>Voltar</Button>
                    <Button type="button" onClick={() => setActiveTab("ai")}>Próximo</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="ai">
                  <CardHeader>
                    <CardTitle>Treino da IA</CardTitle>
                    <CardDescription>
                      Configure o treino da IA para que ela se adapte ao estilo e conteúdo da sua redação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NewsroomAITraining
                      onFilesChange={setTrainingFiles}
                      onUrlsChange={setTrainingUrls}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("team")}>Voltar</Button>
                    <Button type="button" onClick={() => setActiveTab("agents")}>Próximo</Button>
                  </CardFooter>
                </TabsContent>

                <TabsContent value="agents">
                  <CardHeader>
                    <CardTitle>Configuração de Agentes</CardTitle>
                    <CardDescription>
                      Configure agentes inteligentes para automatizar tarefas na sua redação.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="enableAgents"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Habilitar Agentes
                              </FormLabel>
                              <FormDescription>
                                Permite criar agentes inteligentes que podem ajudar nas tarefas da redação
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("enableAgents") && (
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-md">
                            <h3 className="font-medium mb-2">Tipos de Agentes Disponíveis</h3>
                            <ul className="list-disc list-inside space-y-2">
                              <li>
                                <span className="font-medium">Agente de Revisão:</span>
                                <span className="text-muted-foreground"> Revisa automaticamente textos seguindo o estilo editorial da redação</span>
                              </li>
                              <li>
                                <span className="font-medium">Agente de SEO:</span>
                                <span className="text-muted-foreground"> Analisa e otimiza conteúdo para motores de busca</span>
                              </li>
                              <li>
                                <span className="font-medium">Agente de Curadoria:</span>
                                <span className="text-muted-foreground"> Encontra e sugere fontes relevantes para novos artigos</span>
                              </li>
                              <li>
                                <span className="font-medium">Agente de Publicação:</span>
                                <span className="text-muted-foreground"> Automatiza publicação em redes sociais e plataformas</span>
                              </li>
                            </ul>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Após criar a redação, você poderá configurar cada agente individualmente no painel de controle.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("ai")}>Voltar</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
                      {isLoading ? "Criando..." : "Criar Redação"}
                    </Button>
                  </CardFooter>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
}

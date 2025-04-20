
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TranscriptionTable } from "@/components/dashboard/TranscriptionTable";
import { DashboardArticleTable } from "@/components/dashboard/DashboardArticleTable";
import { RecentLearnings } from "@/components/ai-training/RecentLearnings";
import { 
  FileText, 
  Headphones, 
  Clock,
  FilePen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [username, setUsername] = useState("Usuário");
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar dados do usuário e suas transcrições quando a página for montada
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Obter sessão do usuário
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Obter dados do usuário atual
          const { data: userData } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', session.user.id)
            .single();
          
          if (userData?.name) {
            setUsername(userData.name);
          } else {
            setUsername(session.user.email?.split('@')[0] || "Usuário");
          }
          
          // Carregar transcrições do usuário
          const { data: transcriptionsData, error } = await supabase
            .from('transcriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (error) {
            console.error("Erro ao carregar transcrições:", error);
            toast({
              title: "Erro ao carregar dados",
              description: "Não foi possível carregar suas transcrições.",
              variant: "destructive"
            });
          } else {
            // Formatar transcrições para o componente TranscriptionTable
            const formattedTranscriptions = transcriptionsData?.map(t => ({
              id: t.id,
              name: t.name,
              date: new Date(t.created_at).toLocaleDateString('pt-BR'),
              duration: t.duration || "00:00",
              status: t.status
            })) || [];
            
            setTranscriptions(formattedTranscriptions);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeCard username={username} appName="Press AI Pessoal" />

        {/* Recent Learnings Section */}
        <RecentLearnings />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            icon={FileText} 
            title="Artigos" 
            value="0" 
            change={{ value: "Comece a criar", positive: true }}
          />
          <StatsCard 
            icon={Headphones} 
            title="Transcrições" 
            value={transcriptions.length.toString()} 
            change={{ value: "Personalizados", positive: true }}
          />
          <StatsCard 
            icon={Clock} 
            title="Horas Salvas" 
            value="0" 
            change={{ value: "Aumente sua produtividade", positive: true }}
          />
          <StatsCard 
            icon={FilePen} 
            title="Reformulações" 
            value="0" 
            change={{ value: "Experimente agora", positive: true }}
          />
        </div>

        {/* Recent Articles Section */}
        <Card className="bg-white">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-xl">Seus Artigos Recentes</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/articles" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Gestão de Artigos
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Carregando seus artigos...</p>
            ) : (
              <DashboardArticleTable limit={5} />
            )}
          </CardContent>
        </Card>

        {/* Recent Transcriptions Section */}
        <Card className="bg-white">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-xl">Suas Transcrições Recentes</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/transcribe" className="gap-2">
                  <Headphones className="h-4 w-4" />
                  Ver Todas
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-4 text-muted-foreground">Carregando suas transcrições...</p>
            ) : transcriptions.length > 0 ? (
              <TranscriptionTable transcriptions={transcriptions} />
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Você ainda não possui transcrições. Comece a criar agora!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;

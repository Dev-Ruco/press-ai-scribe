
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/contexts/AuthContext";
import { useProgressiveAuth } from "@/hooks/useProgressiveAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";

export const NewsStatsCards = () => {
  const { user } = useAuth();
  const { 
    authDialogOpen, 
    setAuthDialogOpen, 
    requireAuth 
  } = useProgressiveAuth();

  const handleCheckNow = () => {
    requireAuth(() => {
      // Logic for checking news sources when implemented
      console.log("Checking news sources");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>Faça login para ver suas estatísticas.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAuthDialogOpen(true)}
              >
                Entrar para ver estatísticas
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-gray rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">Fontes Ativas</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
                
                <div className="bg-bg-gray rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">Notícias Hoje</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
                
                <div className="bg-bg-gray rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">Atualizações Pendentes</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
                
                <div className="bg-bg-gray rounded-lg p-4">
                  <div className="text-sm text-text-secondary mb-1">Última Verificação</div>
                  <div className="text-base font-medium">--:--</div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4" onClick={handleCheckNow}>
                <RefreshCw size={16} className="mr-2" />
                Verificar Todas Agora
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </div>
  );
};

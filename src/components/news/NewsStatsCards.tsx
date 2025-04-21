
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/contexts/AuthContext";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { useState } from 'react';

export const NewsStatsCards = () => {
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);

  const handleCheckNow = () => {
    if (!user) {
      setPromptOpen(true);
      return;
    }
    // Lógica para verificar fontes quando implementada
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
      <AuthPrompt isOpen={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
};

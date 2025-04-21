
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NewsStatsCards = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Fontes Ativas</div>
              <div className="text-2xl font-semibold">3</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Notícias Hoje</div>
              <div className="text-2xl font-semibold">24</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Atualizações Pendentes</div>
              <div className="text-2xl font-semibold">2</div>
            </div>
            
            <div className="bg-bg-gray rounded-lg p-4">
              <div className="text-sm text-text-secondary mb-1">Última Verificação</div>
              <div className="text-base font-medium">14:30</div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <RefreshCw size={16} className="mr-2" />
            Verificar Todas Agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

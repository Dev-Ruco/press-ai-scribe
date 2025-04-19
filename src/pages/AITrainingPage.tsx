
import { MainLayout } from "@/components/layout/MainLayout";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { Brain, Upload, Link2, FileText, History, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UploadTrainingDocuments } from "@/components/ai-training/UploadTrainingDocuments";
import { ImportFromSource } from "@/components/ai-training/ImportFromSource";
import { EditorialStyleSettings } from "@/components/ai-training/EditorialStyleSettings";
import { TrainingHistory } from "@/components/ai-training/TrainingHistory";
import { RecentLearnings } from "@/components/ai-training/RecentLearnings";

export default function AITrainingPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Brain size={24} className="text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                Administração e Treino da IA
              </h1>
            </div>
            <p className="mt-2 text-muted-foreground">
              Configure e treine a IA do sistema PRESS AI
            </p>
          </div>

          {/* Main content with tabs */}
          <Tabs defaultValue="upload" className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Manual</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="gap-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Importar</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Estilo Editorial</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <UploadTrainingDocuments />
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <ImportFromSource />
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <EditorialStyleSettings />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <TrainingHistory />
            </TabsContent>
          </Tabs>

          {/* Recent learning card */}
          <RecentLearnings />
        </div>
        
        {/* Reusing the same assistant component from CreateArticlePage */}
        <div className="w-full md:w-[280px]">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] border-border/30 shadow-sm bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CardContent className="p-3 h-full">
              <ArticleAssistant />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

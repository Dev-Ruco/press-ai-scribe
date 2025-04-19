
import { ReactNode } from "react";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { ArticleAssistant } from "./ArticleAssistant";
import { SidePanelNews } from "./SidePanelNews";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

interface SidePanelProps {
  children: ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={80} minSize={30} maxSize={85}>
        <div className="h-full"> 
          {children} {/* Aqui vai o painel principal (CreateArticleForm) */}
        </div> 
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
        <div className="h-full border-l bg-background">
          <Tabs defaultValue="assistant" className="h-full flex flex-col">
            <div className="border-b px-4 py-2">
              <TabsList className="w-full">
                <TabsTrigger value="assistant" className="flex-1">Assistente</TabsTrigger>
                <TabsTrigger value="news" className="flex-1">Notícias</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="assistant" className="h-full m-0">
                <ArticleAssistant />
              </TabsContent>
              <TabsContent value="news" className="h-full m-0">
                <SidePanelNews />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

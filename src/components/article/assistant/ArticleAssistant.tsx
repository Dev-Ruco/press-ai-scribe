
import { useState } from "react";
import { MessageSquare, FolderOpen, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssistantHeader } from "./AssistantHeader";
import { AssistantChatTab } from "./tabs/AssistantChatTab";
import { AssistantMaterialTab } from "./tabs/AssistantMaterialTab";
import { AssistantContextTab } from "./tabs/AssistantContextTab";
import { useAssistantChat } from "@/hooks/useAssistantChat";

interface ArticleAssistantProps {
  workflowState?: {
    step?: string;
    files?: any[];
    content?: string;
    articleType?: any;
    title?: string;
    isProcessing?: boolean;
  };
  onWorkflowUpdate?: (updates: any) => void;
}

export function ArticleAssistant({ workflowState = {}, onWorkflowUpdate = () => {} }: ArticleAssistantProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const { messages, isAiTyping, clearChat, handleSendMessage } = useAssistantChat();

  return (
    <div className="h-full flex flex-col">
      <AssistantHeader onNewChat={clearChat} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b px-1 flex-shrink-0">
          <TabsTrigger value="chat" className="text-xs flex gap-1 items-center">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="text-xs flex gap-1 items-center">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Material</span>
          </TabsTrigger>
          <TabsTrigger value="context" className="text-xs flex gap-1 items-center">
            <FileText className="h-3.5 w-3.5" />
            <span>Contexto</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-h-0 relative">
          <TabsContent 
            value="chat" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantChatTab
              messages={messages}
              onSendMessage={handleSendMessage}
              isAiTyping={isAiTyping}
            />
          </TabsContent>
          
          <TabsContent 
            value="organization" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantMaterialTab />
          </TabsContent>
          
          <TabsContent 
            value="context" 
            className="absolute inset-0 m-0 data-[state=active]:flex flex-col"
          >
            <AssistantContextTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

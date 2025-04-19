
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArticleAssistant } from "@/components/article/ArticleAssistant";
import { RecentNewsList } from "@/components/reformulate/RecentNewsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ReformulateAssistant() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-2">
        <CardTitle className="text-lg">Assistente</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Tabs defaultValue="chat" className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="h-[calc(100%-40px)] mt-0">
            <ArticleAssistant />
          </TabsContent>
          <TabsContent value="news" className="h-[calc(100%-40px)] mt-0">
            <RecentNewsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ReformulateEditor() {
  const [content, setContent] = useState("");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Reformular Conteúdo</CardTitle>
          <Button className="gap-2">
            <Wand2 className="h-4 w-4" />
            Reformular
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Cole ou digite o conteúdo que deseja reformular..."
          className="h-full min-h-[500px] rounded-none border-0 resize-none focus-visible:ring-0"
        />
      </CardContent>
    </Card>
  );
}

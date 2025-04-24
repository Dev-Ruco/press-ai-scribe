
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ArticlePreviewProps {
  title?: string;
  content: string;
  className?: string;
}

export function ArticlePreview({ title, content, className }: ArticlePreviewProps) {
  return (
    <Card className={cn("w-full bg-white shadow-sm", className)}>
      {title && (
        <CardHeader className="space-y-2 pb-4 border-b">
          <h1 className="font-playfair text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        </CardHeader>
      )}
      <CardContent className="pt-6">
        <div className="prose prose-slate max-w-none">
          {content.split('\n').map((paragraph, index) => (
            paragraph && (
              <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

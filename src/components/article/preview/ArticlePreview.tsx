
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface ArticlePreviewProps {
  title?: string;
  content: string;
  type?: 'Notícia' | 'Reportagem' | 'Análise' | 'Entrevista' | 'Opinião' | 'Artigo';
  lead?: string;
  sources?: string[];
  className?: string;
}

export function ArticlePreview({ title, content, type = 'Artigo', lead, sources, className }: ArticlePreviewProps) {
  const renderContent = () => {
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    if (type === 'Notícia') {
      return (
        <div className="space-y-6">
          {lead && (
            <p className="text-lg font-medium text-slate-700 leading-relaxed border-l-4 border-primary/20 pl-4">
              {lead}
            </p>
          )}
          
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                return (
                  <blockquote key={index} className="relative pl-4 pr-2 py-2 my-6 border-l-4 border-primary bg-slate-50">
                    <Quote className="absolute -left-7 top-0 h-5 w-5 text-primary/60" />
                    <p className="italic text-slate-700">{paragraph.slice(1, -1)}</p>
                  </blockquote>
                );
              }
              return (
                <p key={index} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
          
          {sources && sources.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200">
              <p className="text-sm font-semibold text-slate-500 mb-2">Fontes:</p>
              <ul className="list-disc list-inside space-y-1">
                {sources.map((source, index) => (
                  <li key={index} className="text-sm text-slate-600">{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="prose prose-slate max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 text-slate-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn(
      "w-full bg-white shadow-sm transition-shadow hover:shadow-md",
      "border border-slate-200/80",
      className
    )}>
      {title && (
        <CardHeader className="space-y-2 pb-4 border-b border-slate-200/80">
          <div className="space-y-2">
            {type && (
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {type}
              </span>
            )}
            <h1 className="font-playfair text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

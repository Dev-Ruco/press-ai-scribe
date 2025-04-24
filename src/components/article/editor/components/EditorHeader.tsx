
import { Badge } from "@/components/ui/badge";

interface EditorHeaderProps {
  articleType: {
    id: string;
    label: string;
    structure: string[];
  };
  stats: {
    words: number;
    characters: number;
  };
  readingTime: string;
}

export function EditorHeader({ articleType, stats, readingTime }: EditorHeaderProps) {
  return (
    <div className="editor-stats-header">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="editor-type-badge">
          {articleType.label}
        </Badge>
        
        <div className="editor-stats-info">
          <span className="flex items-center gap-1">
            <span className="font-medium">{stats.words}</span> palavras
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">{stats.characters}</span> caracteres
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">{readingTime}</span> min leitura
          </span>
        </div>
      </div>
    </div>
  );
}

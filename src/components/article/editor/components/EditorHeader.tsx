
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditorHeaderProps {
  articleType: {
    id: string;
    label: string;
    structure: string[];
  };
  stats: {
    words: number;
    characters: number;
    readingTime: number;
  };
}

export function EditorHeader({ articleType, stats }: EditorHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="editor-stats-header">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="editor-type-badge">
          {articleType.label}
        </Badge>
        
        <div className="editor-stats-info">
          <span className="flex items-center gap-1">
            <span className="font-medium">{stats.words}</span> {t('wordsCount')}
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">{stats.characters}</span> {t('charactersCount')}
          </span>
          <span className="flex items-center gap-1">
            <span className="font-medium">{stats.readingTime}</span> {t('minutes')} {t('readingTime')}
          </span>
        </div>
      </div>
    </div>
  );
}

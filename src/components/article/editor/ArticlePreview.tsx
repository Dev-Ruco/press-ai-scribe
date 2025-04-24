
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface ArticlePreviewProps {
  content: string;
  articleType: {
    id: string;
    label: string;
    structure: string[];
  };
}

export function ArticlePreview({ content, articleType }: ArticlePreviewProps) {
  // Process content to identify title, structure, and formatting
  const processedContent = useMemo(() => {
    if (!content) return { title: "", sections: [] };
    
    const lines = content.split('\n');
    const result = {
      title: "",
      sections: [] as {name: string, content: string}[]
    };
    
    let currentSection = { name: "", content: "" };
    
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        // Main title
        result.title = line.substring(2).trim();
      } else if (line.startsWith('## ')) {
        // Save previous section if it exists
        if (currentSection.name) {
          result.sections.push({...currentSection});
        }
        // Start new section
        currentSection = { 
          name: line.substring(3).trim(),
          content: ""
        };
      } else if (currentSection.name) {
        // Add content to current section
        currentSection.content += line + "\n";
      } else if (!result.title) {
        // Content before any headers might be the lead
        if (line.trim()) {
          result.sections.push({
            name: "Lead",
            content: line
          });
        }
      }
    });
    
    // Add the last section
    if (currentSection.name) {
      result.sections.push({...currentSection});
    }
    
    return result;
  }, [content]);

  // Format markdown content to HTML with proper styling
  const formatContent = (text: string) => {
    if (!text) return "";
    
    let formatted = text
      // Convert bullet points
      .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
      // Convert blockquotes
      .replace(/> "(.*?)" - (.*?)(\n|$)/g, '<blockquote class="border-l-4 border-primary pl-4 py-1 italic my-4">$1<footer class="text-sm text-muted-foreground mt-1">— $2</footer></blockquote>')
      // Add paragraph breaks
      .replace(/\n\n/g, '</p><p>')
      // Preserve line breaks within paragraphs
      .replace(/\n/g, '<br>');
    
    // Wrap lists
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/<li>.*?<\/li>/gs, match => {
        return `<ul class="list-disc ml-6 my-4">${match}</ul>`;
      });
    }
    
    // Wrap in paragraphs if not already
    if (!formatted.startsWith('<') && formatted.trim()) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
  };

  if (!content.trim()) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Pré-visualização aparecerá aqui conforme você edita o conteúdo...
      </div>
    );
  }

  return (
    <div className="p-6 article-preview bg-white border rounded-md min-h-[500px]">
      {/* Article Type Badge */}
      <div className="mb-4">
        <Badge variant="outline" className="text-xs font-medium">
          {articleType.label}
        </Badge>
      </div>
      
      {/* Main Title */}
      {processedContent.title && (
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-6 text-text-primary leading-tight">
          {processedContent.title}
        </h1>
      )}
      
      {/* Article Sections */}
      <div className="article-content">
        {processedContent.sections.map((section, index) => (
          <div key={index} className="mb-6">
            {section.name !== "Lead" && (
              <h2 className="text-xl sm:text-2xl font-playfair font-semibold mb-3 text-text-primary">
                {section.name}
              </h2>
            )}
            
            <div 
              className={`prose prose-slate max-w-none ${section.name === "Lead" ? "text-lg font-medium text-text-secondary" : ""}`}
              dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

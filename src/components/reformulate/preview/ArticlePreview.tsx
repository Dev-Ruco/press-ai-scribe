import { useMemo } from "react";

interface ArticlePreviewProps {
  content: string;
  title?: string;
}

export function ArticlePreview({ content, title }: ArticlePreviewProps) {
  // Process content to identify title, lead paragraph, and body
  const processedContent = useMemo(() => {
    if (!content) return { title: "", lead: "", body: [] };
    
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return { title: "", lead: "", body: [] };
    
    // First non-empty line is usually the title if no title prop is provided
    const firstLine = lines[0];
    const detectedTitle = title || firstLine;
    
    // Second non-empty line or paragraph is often the lead
    const lead = lines.length > 1 ? lines[1] : "";
    
    // Rest of the content forms the body
    const startIndex = title ? 0 : 2;
    const body = lines.slice(startIndex).filter(line => line !== firstLine && line !== lead);
    
    return {
      title: detectedTitle,
      lead,
      body
    };
  }, [content, title]);

  // Function to convert Markdown-like syntax to HTML
  const formatText = (text: string) => {
    // Replace bullet points
    let formatted = text.replace(/- (.+)/g, '<li>$1</li>');
    
    // Wrap lists
    if (formatted.includes('<li>')) {
      formatted = `<ul>${formatted}</ul>`;
    }
    
    return formatted;
  };

  if (!content.trim()) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Preview aparecerá aqui conforme você digita...
      </div>
    );
  }

  return (
    <div className="p-6 article-text">
      <h1 className="article-title font-playfair">{processedContent.title}</h1>
      
      {processedContent.lead && (
        <p className="article-lead">{processedContent.lead}</p>
      )}
      
      <div className="mt-6 space-y-4">
        {processedContent.body.map((paragraph, index) => {
          if (paragraph.startsWith('- ')) {
            // This is a list item, collect all consecutive list items
            const listItems = [paragraph];
            let i = index + 1;
            while (i < processedContent.body.length && 
                   processedContent.body[i].startsWith('- ')) {
              listItems.push(processedContent.body[i]);
              i++;
            }
            
            return (
              <ul key={`list-${index}`} className="ml-6 my-4 space-y-2">
                {listItems.map((item, itemIndex) => (
                  <li key={`item-${index}-${itemIndex}`} className="list-disc">
                    {item.substring(2)}
                  </li>
                ))}
              </ul>
            );
          }
          
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
    </div>
  );
}

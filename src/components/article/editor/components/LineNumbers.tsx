
interface LineNumbersProps {
  content: string;
  focusedLine: number | null;
  sections: Array<{ name: string; line: number }>;
  getSectionColor: (sectionName: string) => string;
}

export function LineNumbers({ content, focusedLine, sections, getSectionColor }: LineNumbersProps) {
  return (
    <div className="line-numbers-panel">
      {content.split('\n').map((_, index) => {
        const lineNumber = index + 1;
        const section = sections.find(s => s.line === lineNumber);
        
        return (
          <div 
            key={index} 
            className={`line-number ${focusedLine === lineNumber ? 'line-number-active' : ''}`}
          >
            <div className="flex items-center">
              {section && (
                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  getSectionColor(section.name).split(' ')[0].replace('bg-', 'bg-')
                }`} />
              )}
              <span className="text-xs tabular-nums">{lineNumber}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

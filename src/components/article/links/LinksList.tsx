
import { Button } from "@/components/ui/button";

interface LinksListProps {
  links: Array<{ url: string; id: string }>;
  onRemove: (linkId: string) => void;
}

export function LinksList({ links, onRemove }: LinksListProps) {
  if (links.length === 0) return null;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-background/50">
      <h3 className="text-lg font-medium mb-2">Links anexados</h3>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.id} className="flex items-center justify-between text-sm border p-2 rounded">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {link.url}
            </a>
            <button 
              onClick={() => onRemove(link.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

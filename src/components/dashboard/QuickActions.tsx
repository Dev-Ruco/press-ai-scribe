
import { Button } from "@/components/ui/button";
import { FilePlus, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
      <Button
        asChild
        className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
      >
        <Link to="/new-article">
          <FilePlus size={20} />
          <span>Gerar Artigo</span>
        </Link>
      </Button>
      
      <Button
        asChild
        className="w-full sm:w-[200px] bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
      >
        <Link to="/reformulate">
          <RefreshCw size={20} />
          <span>Reformular Artigo</span>
        </Link>
      </Button>
    </div>
  );
}

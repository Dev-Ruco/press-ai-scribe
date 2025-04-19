
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FilePlus, Menu, Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  return (
    <header className="h-[72px] border-b border-border bg-white px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-primary hover:bg-primary/10 transition-colors" 
          onClick={onToggleMobileSidebar}
        >
          <Menu size={24} />
        </Button>
        <img 
          src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
          alt="Press AI Logo" 
          className="h-12 transition-transform duration-200 hover:scale-105" 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          className="hidden md:flex bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
        >
          <FilePlus size={18} />
          <span>Novo Artigo</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-primary hover:bg-primary/10 transition-all duration-200"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 bg-destructive w-2 h-2 rounded-full animate-pulse" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="p-1 hover:bg-primary/10 transition-all duration-200"
            >
              <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>EA</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-white shadow-lg border border-border"
          >
            <DropdownMenuItem className="cursor-pointer transition-colors">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-colors">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive transition-colors">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FilePlus, Menu, Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

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
          className="md:hidden text-primary hover:bg-primary/10 transition-all duration-200" 
          onClick={onToggleMobileSidebar}
        >
          <Menu size={24} />
        </Button>
        <Link to="/">
          <img 
            src="/lovable-uploads/db3d147e-9c95-4af5-bbeb-9c68dcc60353.png" 
            alt="Press AI Logo" 
            className="h-16 transition-transform duration-200 hover:scale-105" 
          />
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                asChild
                className="hidden md:flex bg-primary hover:bg-primary-dark text-white gap-2 transition-all duration-200 hover:shadow-md"
              >
                <Link to="/new-article">
                  <FilePlus size={18} />
                  <span>Novo Artigo</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Criar um novo artigo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-primary hover:bg-primary/10 transition-all duration-200"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-destructive w-2 h-2 rounded-full animate-pulse" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
            className="w-48 bg-white shadow-lg border border-border z-50"
          >
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/5">
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-colors hover:bg-primary/5">
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive transition-colors hover:bg-destructive/5">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

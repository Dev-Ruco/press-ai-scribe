
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarFooterProps {
  collapsed?: boolean;
}

export function SidebarFooter({ collapsed = false }: SidebarFooterProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'pt' ? "Erro ao realizar logout" : "Error logging out",
        description: language === 'pt' ? "Tente novamente mais tarde" : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-auto border-t border-slate-200 pt-3 pb-4 px-3">
      {/* User profile and settings */}
      <div className={cn(
        "flex items-center",
        collapsed ? "flex-col gap-3" : "px-2 justify-between"
      )}>
        {user ? (
          <>
            {/* User dropdown menu */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-sm bg-slate-100 text-black">
                          {user?.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right" hidden={!collapsed}>
                  <p>{user?.email}</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent className="w-56 bg-white text-black border-slate-200" align="end" sideOffset={5} forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem 
                  onClick={() => navigate('/settings/profile')} 
                  className="text-sm focus:bg-slate-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{language === 'pt' ? "Conta" : "Account"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings/plan')} 
                  className="text-sm focus:bg-slate-100"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{language === 'pt' ? "Plano" : "Plan"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-sm text-red-600 focus:bg-slate-100 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{language === 'pt' ? "Sair" : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Plan button (only visible when not collapsed) */}
            {!collapsed && (
              <Button
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings/plan')}
                className="h-8 text-xs bg-transparent border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100"
              >
                <CreditCard size={14} className="mr-1.5" />
                {language === 'pt' ? "Plano" : "Plan"}
              </Button>
            )}
          </>
        ) : (
          /* Login button if not logged in */
          <div className={cn(
            "flex",
            collapsed ? "flex-col gap-2" : "gap-2 w-full"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className={cn(
                    "border-slate-200 text-slate-700 hover:text-black hover:bg-slate-100",
                    collapsed ? "w-9 h-9 p-0" : "flex-1"
                  )}
                >
                  {collapsed ? (
                    <User size={18} />
                  ) : (
                    language === 'pt' ? "Entrar" : "Login"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!collapsed}>
                <p>{language === 'pt' ? "Entrar" : "Login"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

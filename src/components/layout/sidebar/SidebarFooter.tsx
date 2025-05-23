
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, CreditCard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/common/LanguageSelector";
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
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'pt-MZ' ? "Erro ao realizar logout" : "Error logging out",
        description: language === 'pt-MZ' ? "Tente novamente mais tarde" : "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-auto border-t border-[#393939] pt-3 pb-4 px-3">
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
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 text-white hover:bg-[#3D3D3D]">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-sm bg-[#393939] text-white">
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
                  <span>{language === 'pt-MZ' ? "Conta" : "Account"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings/plan')} 
                  className="text-sm focus:bg-slate-100"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{language === 'pt-MZ' ? "Plano" : "Plan"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200" />
                
                {/* Language selection */}
                <div className="px-2 py-1.5">
                  <div className="flex items-center mb-1">
                    <Globe className="mr-2 h-4 w-4 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      {language === 'pt-MZ' ? "Idioma" : "Language"}
                    </span>
                  </div>
                  <LanguageSelector className="w-full" />
                </div>
                
                <DropdownMenuSeparator className="bg-slate-200" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-sm text-red-600 focus:bg-slate-100 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{language === 'pt-MZ' ? "Sair" : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Plan button (only visible when not collapsed) */}
            {!collapsed && (
              <Button
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings/plan')}
                className="h-8 text-xs bg-transparent border-[#393939] text-white hover:text-white hover:bg-[#3D3D3D]"
              >
                <CreditCard size={14} className="mr-1.5" />
                {language === 'pt-MZ' ? "Plano" : "Plan"}
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
                    "border-[#393939] text-white hover:text-white hover:bg-[#3D3D3D]",
                    collapsed ? "w-9 h-9 p-0" : "flex-1"
                  )}
                >
                  {collapsed ? (
                    <User size={18} />
                  ) : (
                    language === 'pt-MZ' ? "Entrar" : "Login"
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" hidden={!collapsed}>
                <p>{language === 'pt-MZ' ? "Entrar" : "Login"}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Language selector for non-logged in users */}
            {!collapsed && (
              <LanguageSelector variant="compact" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}


import { Button, ButtonProps } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  redirectTo?: string;
}

export function LogoutButton({
  variant = "outline",
  size = "default",
  showIcon = true,
  redirectTo = "/",
  className,
  children,
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout. Tente novamente."
      });
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleLogout}
      className={className}
      {...props}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Sair"}
    </Button>
  );
}

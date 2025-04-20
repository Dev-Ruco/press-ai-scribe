
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { Google, Apple, Linkedin } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg space-y-8 bg-white rounded-lg p-8">
        <div className="text-center space-y-2">
          <Logo className="mx-auto h-12 w-auto" />
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Bem-vindo de volta" : "Criar uma conta"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? "Entre com sua conta para continuar" 
              : "Cadastre-se para começar a usar o Press AI"}
          </p>
        </div>

        <div className="space-y-6">
          <AuthForm 
            mode={isLogin ? 'login' : 'signup'} 
            onToggleMode={() => setIsLogin(!isLogin)}
            onSuccess={() => navigate('/')}
            className="space-y-4"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" type="button">
              <Google className="h-5 w-5" />
              <span className="sr-only">Google</span>
            </Button>
            <Button variant="outline" type="button">
              <Apple className="h-5 w-5" />
              <span className="sr-only">Apple</span>
            </Button>
            <Button variant="outline" type="button">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

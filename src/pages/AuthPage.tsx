
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <AuthForm 
        mode={isLogin ? 'login' : 'signup'} 
        onToggleMode={() => setIsLogin(!isLogin)}
        onSuccess={() => navigate('/')}
      />
    </AuthLayout>
  );
}

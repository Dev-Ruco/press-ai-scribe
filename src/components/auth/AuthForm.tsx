
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess: () => void;
  className?: string;
}

const EDITORIAL_SPECIALTIES = [
  'Jornalismo Político',
  'Jornalismo Econômico',
  'Jornalismo Cultural',
  'Jornalismo Esportivo',
  'Jornalismo Internacional',
  'Jornalismo de Saúde',
  'Jornalismo Educacional',
  'Jornalismo Investigativo',
  'Jornalismo Ambiental',
  'Jornalismo de Tecnologia'
];

const COUNTRIES = [
  { code: 'AO', name: 'Angola' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'GW', name: 'Guiné-Bissau' },
  { code: 'MZ', name: 'Moçambique' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ST', name: 'São Tomé e Príncipe' },
  { code: 'TL', name: 'Timor-Leste' }
];

export function AuthForm({ mode, onToggleMode, onSuccess, className }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!firstName || !lastName || !country || specialties.length === 0) {
          throw new Error("Por favor, preencha todos os campos obrigatórios");
        }

        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              country: country,
              specialties: specialties,
            }
          }
        });

        if (signUpError) throw signUpError;
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao sistema!",
        });

      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso.",
        });
      }
      
      onSuccess();
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  const handleError = (error: any) => {
    let message = "Ocorreu um erro inesperado";
    
    switch (error.message) {
      case "Invalid login credentials":
        message = "Email ou senha incorretos";
        break;
      case "User already registered":
        message = "Este email já está cadastrado";
        break;
      default:
        message = `Erro: ${error.message}`;
    }
    
    setError(message);
  };

  return (
    <div className={className}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(({ code, name }) => (
                    <SelectItem key={code} value={code} className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={code} svg className="w-4 h-4" />
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Especialidades Jornalísticas</Label>
              <div className="grid grid-cols-2 gap-2">
                {EDITORIAL_SPECIALTIES.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={specialties.includes(specialty)}
                      onCheckedChange={(checked) => {
                        setSpecialties(prev =>
                          checked
                            ? [...prev, specialty]
                            : prev.filter(s => s !== specialty)
                        );
                      }}
                    />
                    <Label htmlFor={specialty}>{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? "Entrar" : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-primary hover:underline"
              >
                Crie uma agora
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="font-medium text-primary hover:underline"
              >
                Entre
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

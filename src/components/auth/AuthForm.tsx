import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2, Eye, EyeOff, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import ReactCountryFlag from "react-country-flag";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EDITORIAL_SPECIALTIES, COUNTRIES } from "./constants";
import { PhoneInput } from "@/components/ui/phone-input";
interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess: () => void;
  className?: string;
}
export function AuthForm({
  mode,
  onToggleMode,
  onSuccess,
  className
}: AuthFormProps) {
  const [email, setEmail] = useState(""); // Changed from identifier to email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    toast
  } = useToast();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!firstName || !lastName || !country || specialties.length === 0 || !birthDate || !whatsappNumber || !email) {
          throw new Error("Por favor, preencha todos os campos obrigatórios");
        }
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem");
        }
        const metadata = {
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate.toISOString().split('T')[0],
          country: country,
          whatsapp_number: whatsappNumber,
          specialties: specialties,
          full_name: `${firstName} ${lastName}`
        };
        const {
          error: signUpError
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata
          }
        });
        if (signUpError) throw signUpError;
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao sistema!"
        });
      } else {
        const {
          error: signInError
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso."
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
        message = "Email/WhatsApp ou senha incorretos";
        break;
      case "User already registered":
        message = "Este email/WhatsApp já está cadastrado";
        break;
      default:
        message = `Erro: ${error.message}`;
    }
    setError(message);
  };
  return <div className={className}>
      {error && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apelido</Label>
                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <DatePicker value={birthDate} onChange={setBirthDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(({
                code,
                name
              }) => <SelectItem key={code} value={code} className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={code} svg className="w-4 h-4" />
                      {name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <PhoneInput id="whatsapp" value={whatsappNumber} onChange={setWhatsappNumber} required />
            </div>

            <div className="space-y-2">
              <Label>Especialidades Jornalísticas</Label>
              <div className="grid grid-cols-2 gap-2">
                {EDITORIAL_SPECIALTIES.map(specialty => <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox id={specialty} checked={specialties.includes(specialty)} onCheckedChange={checked => {
                setSpecialties(prev => checked ? [...prev, specialty] : prev.filter(s => s !== specialty));
              }} />
                    <Label htmlFor={specialty}>{specialty}</Label>
                  </div>)}
              </div>
            </div>
          </>}

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Digite seu e-mail" required />
        </div>

        {mode === 'signup'}

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {mode === 'signup' && <>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            
          </>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? "Entrar" : "Criar conta"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? <>
              Não tem uma conta?{" "}
              <button type="button" onClick={onToggleMode} className="font-medium text-primary hover:underline">
                Crie uma agora
              </button>
            </> : <>
              Já tem uma conta?{" "}
              <button type="button" onClick={onToggleMode} className="font-medium text-primary hover:underline">
                Entre
              </button>
            </>}
        </p>
      </form>
    </div>;
}

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { EDITORIAL_SPECIALTIES, COUNTRIES } from "@/components/auth/constants";
import ReactCountryFlag from "react-country-flag";

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setFirstName(metadata?.first_name || '');
        setLastName(metadata?.last_name || '');
        setBirthDate(metadata?.birth_date ? new Date(metadata.birth_date) : null);
        setCountry(metadata?.country || '');
        setWhatsappNumber(metadata?.whatsapp_number || '');
        setSpecialties(metadata?.specialties || []);
        setEmail(session.user.email || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do usuário"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate?.toISOString().split('T')[0],
          country: country,
          whatsapp_number: whatsappNumber,
          specialties: specialties,
          full_name: `${firstName} ${lastName}`
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil"
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando dados do perfil...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Configurações do Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <CardTitle>Informações Pessoais</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apelido</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
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
                  {COUNTRIES.map(({ code, name }) => (
                    <SelectItem key={code} value={code} className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={code} svg />
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <PhoneInput value={whatsappNumber} onChange={setWhatsappNumber} />
            </div>

            <div className="space-y-2">
              <Label>Especialidades Jornalísticas</Label>
              <div className="grid grid-cols-2 gap-2">
                {EDITORIAL_SPECIALTIES.map(specialty => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox 
                      id={specialty} 
                      checked={specialties.includes(specialty)}
                      onCheckedChange={checked => {
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

            <Button onClick={handleUpdateProfile}>Salvar Alterações</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

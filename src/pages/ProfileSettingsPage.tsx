
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save, Settings, Bell, Globe, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { EDITORIAL_SPECIALTIES, COUNTRIES } from "@/components/auth/constants";
import ReactCountryFlag from "react-country-flag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [country, setCountry] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Preferências de notificação
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  
  // Configurações de privacidade
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }

        if (profile) {
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setBirthDate(profile.birth_date ? new Date(profile.birth_date) : null);
          setCountry(profile.country || '');
          setWhatsappNumber(profile.whatsapp_number || '');
          setSpecialties(profile.specialties || []);
          setBio(profile.bio || '');
          setLanguages(profile.languages || []);
          setWebsite(profile.website || '');
          setAvatarUrl(profile.avatar_url || '');
          setEmailNotifications(profile.email_notifications !== false);
          setWhatsappNotifications(profile.whatsapp_notifications === true);
          setShowEmail(profile.show_email === true);
          setShowPhone(profile.show_phone === true);
        }
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
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Não há sessão de usuário ativa');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate?.toISOString().split('T')[0],
          country: country,
          whatsapp_number: whatsappNumber,
          specialties: specialties,
          bio: bio,
          languages: languages,
          website: website,
          avatar_url: avatarUrl,
          email_notifications: emailNotifications,
          whatsapp_notifications: whatsappNotifications,
          show_email: showEmail,
          show_phone: showPhone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível atualizar o perfil: ${error.message}`
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Aqui você pode implementar o upload da imagem para o Supabase Storage
      // Por enquanto, apenas simulamos com um URL local
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao carregar avatar:', error);
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

  const LANGUAGES = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'Inglês' },
    { code: 'es', name: 'Espanhol' },
    { code: 'fr', name: 'Francês' },
    { code: 'de', name: 'Alemão' },
    { code: 'it', name: 'Italiano' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Configurações do Perfil</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="mb-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferências
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <CardTitle>Informações Pessoais</CardTitle>
                </div>
                <CardDescription>
                  Atualize suas informações pessoais e como você aparece no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
                      ) : (
                        <AvatarFallback>
                          {firstName && lastName 
                            ? `${firstName[0]}${lastName[0]}`
                            : "User"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground cursor-pointer"
                    >
                      <UserCircle className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="sr-only"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        type="url" 
                        placeholder="https://seu-site.com" 
                        value={website} 
                        onChange={e => setWebsite(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Conte um pouco sobre você..." 
                        value={bio} 
                        onChange={e => setBio(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
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
                  <Label>Idiomas</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LANGUAGES.map(language => (
                      <div key={language.code} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`lang-${language.code}`} 
                          checked={languages.includes(language.code)}
                          onCheckedChange={(checked) => {
                            setLanguages(prev => 
                              checked 
                                ? [...prev, language.code]
                                : prev.filter(l => l !== language.code)
                            );
                          }} 
                        />
                        <Label htmlFor={`lang-${language.code}`}>{language.name}</Label>
                      </div>
                    ))}
                  </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Gerencie suas preferências de sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma da Interface</Label>
                  <Select defaultValue="pt">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="UTC-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-3">Brasília (UTC-3)</SelectItem>
                      <SelectItem value="UTC-4">Manaus (UTC-4)</SelectItem>
                      <SelectItem value="UTC-5">Acre (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">Lisboa (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure como deseja receber as notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por Email</h3>
                    <p className="text-sm text-muted-foreground">Receba atualizações por email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Receba atualizações por WhatsApp</p>
                  </div>
                  <Switch 
                    checked={whatsappNotifications} 
                    onCheckedChange={setWhatsappNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
                <CardDescription>Gerencie quem pode ver suas informações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mostrar Endereço de Email</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu email</p>
                  </div>
                  <Switch 
                    checked={showEmail} 
                    onCheckedChange={setShowEmail} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mostrar Número de WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu WhatsApp</p>
                  </div>
                  <Switch 
                    checked={showPhone} 
                    onCheckedChange={setShowPhone}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleUpdateProfile} 
          className="flex gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <>Salvando...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </MainLayout>
  );
}

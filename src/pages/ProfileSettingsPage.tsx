import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save, Settings, Bell, Globe, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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

// Define type for profile to match database columns
type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  country: string | null;
  whatsapp_number: string | null;
  specialties: string[] | null;
  email: string | null;
  bio: string | null;
  languages: string[] | null;
  website: string | null;
  avatar_url: string | null;
  email_notifications: boolean | null;
  whatsapp_notifications: boolean | null;
  show_email: boolean | null;
  show_phone: boolean | null;
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }

        if (profileData) {
          setProfile({
            ...profileData,
            email: session.user.email
          });
        }
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
          ...profile,
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

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleProfileChange('avatar_url', e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao carregar avatar:', error);
    }
  };

  const LANGUAGES = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'Inglês' },
    { code: 'es', name: 'Espanhol' },
    { code: 'fr', name: 'Francês' },
    { code: 'de', name: 'Alemão' },
    { code: 'it', name: 'Italiano' },
  ];

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
                {/* Avatar section */}
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profile.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                      ) : (
                        <AvatarFallback>
                          {profile.first_name && profile.last_name 
                            ? `${profile.first_name[0]}${profile.last_name[0]}`
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
                          value={profile.first_name || ''} 
                          onChange={e => handleProfileChange('first_name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Apelido</Label>
                        <Input 
                          id="lastName" 
                          value={profile.last_name || ''} 
                          onChange={e => handleProfileChange('last_name', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profile.email || ''} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        type="url" 
                        placeholder="https://seu-site.com" 
                        value={profile.website || ''} 
                        onChange={e => handleProfileChange('website', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <DatePicker value={profile.birth_date ? new Date(profile.birth_date) : null} onChange={(date) => handleProfileChange('birth_date', date?.toISOString().split('T')[0])} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select value={profile.country || ''} onValueChange={(value) => handleProfileChange('country', value)}>
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
                  <PhoneInput value={profile.whatsapp_number || ''} onChange={(value) => handleProfileChange('whatsapp_number', value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Conte um pouco sobre você..." 
                    value={profile.bio || ''} 
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Language selection */}
                <div className="space-y-2">
                  <Label>Idiomas</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LANGUAGES.map(language => (
                      <div key={language.code} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`lang-${language.code}`} 
                          checked={profile.languages?.includes(language.code)}
                          onCheckedChange={(checked) => {
                            const currentLanguages = profile.languages || [];
                            const newLanguages = checked
                              ? [...currentLanguages, language.code]
                              : currentLanguages.filter(l => l !== language.code);
                            handleProfileChange('languages', newLanguages);
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
                          checked={profile.specialties?.includes(specialty)}
                          onCheckedChange={checked => {
                            const currentSpecialties = profile.specialties || [];
                            const newSpecialties = checked
                              ? [...currentSpecialties, specialty]
                              : currentSpecialties.filter(s => s !== specialty);
                            handleProfileChange('specialties', newSpecialties);
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

          {/* Preferences tab stays the same */}
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

          {/* Notifications tab */}
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
                    checked={profile.email_notifications ?? true} 
                    onCheckedChange={(checked) => handleProfileChange('email_notifications', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Receba atualizações por WhatsApp</p>
                  </div>
                  <Switch 
                    checked={profile.whatsapp_notifications ?? false} 
                    onCheckedChange={(checked) => handleProfileChange('whatsapp_notifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy tab */}
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
                    checked={profile.show_email ?? false} 
                    onCheckedChange={(checked) => handleProfileChange('show_email', checked)} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mostrar Número de WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu WhatsApp</p>
                  </div>
                  <Switch 
                    checked={profile.show_phone ?? false} 
                    onCheckedChange={(checked) => handleProfileChange('show_phone', checked)}
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

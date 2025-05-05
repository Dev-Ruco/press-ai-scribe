
import { useLanguage } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { Globe } from "lucide-react";

export default function ProfileSettingsPage() {
  const { language } = useLanguage();
  
  // Text content based on current language
  const content = {
    title: language === 'pt-MZ' ? "Configurações do Perfil" : "Profile Settings",
    tabs: {
      personal: language === 'pt-MZ' ? "Pessoal" : "Personal",
      preferences: language === 'pt-MZ' ? "Preferências" : "Preferences",
      notifications: language === 'pt-MZ' ? "Notificações" : "Notifications",
      privacy: language === 'pt-MZ' ? "Privacidade" : "Privacy",
    },
    personalInfo: language === 'pt-MZ' ? "Informações Pessoais" : "Personal Information",
    name: language === 'pt-MZ' ? "Nome" : "Name",
    email: language === 'pt-MZ' ? "Email" : "Email",
    save: language === 'pt-MZ' ? "Salvar Alterações" : "Save Changes",
    languageSettings: language === 'pt-MZ' ? "Configurações de Idioma" : "Language Settings",
    interfaceLanguage: language === 'pt-MZ' ? "Idioma da Interface" : "Interface Language",
    noSettings: language === 'pt-MZ' ? "Nenhuma configuração disponível" : "No settings available",
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{content.title}</h2>
        </div>

        <Tabs defaultValue="personal">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">{content.tabs.personal}</TabsTrigger>
            <TabsTrigger value="preferences">{content.tabs.preferences}</TabsTrigger>
            <TabsTrigger value="notifications">{content.tabs.notifications}</TabsTrigger>
            <TabsTrigger value="privacy">{content.tabs.privacy}</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{content.personalInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label>{content.name}</label>
                  <Input placeholder={language === 'pt-MZ' ? "Seu nome" : "Your name"} />
                </div>
                <div className="space-y-2">
                  <label>{content.email}</label>
                  <Input placeholder={language === 'pt-MZ' ? "Seu email" : "Your email"} disabled />
                </div>
                <Button>{content.save}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{content.tabs.preferences}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center mb-1">
                    <Globe className="mr-2 h-4 w-4 text-slate-500" />
                    <label className="text-sm font-medium">{content.interfaceLanguage}</label>
                  </div>
                  <LanguageSelector />
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'pt-MZ' 
                      ? "Esta configuração afecta todo o texto da interface do sistema."
                      : "This setting affects all system interface text."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{content.tabs.notifications}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{content.noSettings}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>{content.tabs.privacy}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{content.noSettings}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

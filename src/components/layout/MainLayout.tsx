
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// WorkspaceSwitcher melhorado para mostrar logos e cores das redações
function WorkspaceSwitcher() {
  const {
    current,
    organisations,
    switchToPersonal,
    switchToOrganisation,
  } = useWorkspace();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          className={`px-3 py-1 rounded flex items-center gap-2 ${
            current.type === "personal"
              ? "bg-primary text-white"
              : "bg-muted text-foreground"
          }`}
          onClick={switchToPersonal}
          variant={current.type === "personal" ? "default" : "outline"}
          size="sm"
        >
          <Avatar className="h-5 w-5">
            <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>Pessoal</span>
        </Button>
        
        {organisations.map((org) => (
          <Button
            key={org.id}
            className={`px-3 py-1 rounded flex items-center gap-2`}
            style={org.primaryColor && current.type === "organisation" && current.organisation?.id === org.id ? 
              { backgroundColor: org.primaryColor, color: '#fff' } : {}}
            onClick={() => switchToOrganisation(org)}
            variant={(current.type === "organisation" && current.organisation?.id === org.id) 
              ? "default" 
              : "outline"}
            size="sm"
          >
            {org.logoUrl ? (
              <Avatar className="h-5 w-5">
                <AvatarImage src={org.logoUrl} alt={org.name} />
                <AvatarFallback>{org.name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-5 w-5">
                <AvatarFallback>{org.name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <span>{org.name}</span>
          </Button>
        ))}
        
        <Button 
          onClick={() => navigate('/create-newsroom')}
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} />
          <span>Nova Redação</span>
        </Button>
      </div>
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header onToggleMobileSidebar={toggleMobileSidebar} />
        <div className="flex flex-1 w-full mx-auto max-w-[1280px]">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <main id="main-content" className="flex-1 p-4 overflow-y-auto pb-12">
              <WorkspaceSwitcher />
              {children}
            </main>
          </div>
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onClose={toggleMobileSidebar}
          />
        </div>
      </div>
    </WorkspaceProvider>
  );
}

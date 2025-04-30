
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";

function WorkspaceSwitcher() {
  const { current, organisations, switchToPersonal, switchToOrganisation } = useWorkspace();

  if (organisations.length === 0) return null;
  return (
    <div className="mb-6 flex gap-2 items-center">
      <button
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium",
          current.type === "personal"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:bg-white/60"
        )}
        onClick={switchToPersonal}
      >
        Personal
      </button>
      {organisations.map((org) => (
        <button
          key={org.id}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium",
            current.type === "organisation" && current.organisation?.id === org.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:bg-white/60"
          )}
          onClick={() => switchToOrganisation(org)}
        >
          {org.name}
        </button>
      ))}
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        {/* Minimal top bar only for mobile and showing logo */}
        <div className="h-14 flex items-center px-4 border-b border-border/30 bg-white/80 backdrop-blur-md md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo size="small" />
        </div>
        
        <div className="flex flex-1 relative">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#111111]">
                <Sidebar />
              </SheetContent>
            </Sheet>
          ) : (
            <div 
              className={cn(
                "fixed left-0 top-0 bottom-0 transition-all duration-300 z-20 group",
                sidebarCollapsed ? "w-14 hover:w-56" : "w-56"
              )}
              onMouseEnter={() => setSidebarCollapsed(false)}
              onMouseLeave={() => setSidebarCollapsed(true)}
            >
              <Sidebar collapsed={sidebarCollapsed} />
            </div>
          )}
          
          <main 
            className={cn(
              "flex-1 transition-all duration-300 min-h-screen overflow-hidden",
              !isMobile && (sidebarCollapsed ? "ml-14" : "ml-56"),
              isMobile && "pt-14" // Add top padding only on mobile for the minimal header
            )}
          >
            {children}
          </main>
        </div>

        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-white shadow-md z-50"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
      </div>
    </WorkspaceProvider>
  );
}


import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

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
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex flex-1 relative pt-16">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#111111]">
                <Sidebar />
              </SheetContent>
            </Sheet>
          ) : (
            <div 
              className={cn(
                "fixed left-0 top-16 bottom-0 transition-all duration-300 z-20 group",
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
              "flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)]",
              !isMobile && (sidebarCollapsed ? "ml-14" : "ml-56")
            )}
          >
            <div className="max-w-[1440px] mx-auto p-8">
              <WorkspaceSwitcher />
              <div className="bg-white rounded-lg border border-border/30 min-h-[calc(100vh-12rem)]">
                <div className="px-8 py-6">{children}</div>
              </div>
            </div>
          </main>
        </div>

        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-white shadow-md z-50"
            onClick={toggleSidebar}
          >
            <MoreVertical className="h-6 w-6" />
          </Button>
        )}
      </div>
    </WorkspaceProvider>
  );
}

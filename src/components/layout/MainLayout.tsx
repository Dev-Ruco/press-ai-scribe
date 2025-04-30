
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
        <div className="flex flex-1 relative">
          {isMobile ? (
            <>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-[280px] p-0 bg-[#111111]">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="icon"
                className="fixed top-4 left-4 z-50 rounded-full w-10 h-10 bg-white shadow-md"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </>
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
              "p-4 md:p-6"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}

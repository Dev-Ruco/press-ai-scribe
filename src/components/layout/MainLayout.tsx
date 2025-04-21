
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

// WorkspaceSwitcher added for UI (simple select/dropdown)
function WorkspaceSwitcher() {
  const {
    current,
    organisations,
    switchToPersonal,
    switchToOrganisation,
  } = useWorkspace();

  if (organisations.length === 0) return null;
  return (
    <div className="mb-4 flex gap-2 items-center">
      <button
        className={`px-3 py-1 rounded ${
          current.type === "personal"
            ? "bg-primary text-white"
            : "bg-muted-foreground text-foreground"
        }`}
        onClick={switchToPersonal}
      >
        Personal
      </button>
      {organisations.map((org) => (
        <button
          key={org.id}
          className={`px-3 py-1 rounded ${
            current.type === "organisation" &&
            current.organisation?.id === org.id
              ? "bg-primary text-white"
              : "bg-muted-foreground text-foreground"
          }`}
          onClick={() => switchToOrganisation(org)}
        >
          {org.name}
        </button>
      ))}
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
      <div className="min-h-screen bg-[#111111] flex flex-col">
        <Header onToggleMobileSidebar={toggleMobileSidebar} />
        <div className="flex flex-1 w-full mx-auto max-w-[1280px]">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <main id="main-content" className="flex-1 p-3 overflow-y-auto">
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

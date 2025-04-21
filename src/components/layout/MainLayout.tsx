
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
    <div className="mb-2 flex gap-2 items-center">
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header onToggleMobileSidebar={toggleMobileSidebar} />
        <div className="flex h-full max-w-[1280px] mx-auto w-full">
          <Sidebar />
          <main id="main-content" className="flex-1 p-4 min-h-screen overflow-auto">
            <WorkspaceSwitcher />
            {children}
          </main>
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onClose={toggleMobileSidebar}
          />
        </div>
      </div>
    </WorkspaceProvider>
  );
}

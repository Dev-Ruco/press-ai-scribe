
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

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
  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-14 transition-all duration-200 group-hover/sidebar:ml-56">
            <div className="max-w-[1440px] mx-auto p-8">
              <WorkspaceSwitcher />
              <div className="bg-white rounded-lg border border-border/30 min-h-[calc(100vh-12rem)]">
                <div className="px-8 py-6">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}

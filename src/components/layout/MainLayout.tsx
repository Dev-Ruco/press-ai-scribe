
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { WorkspaceProvider, useWorkspace } from "@/contexts/WorkspaceContext";

function WorkspaceSwitcher() {
  const {
    current,
    organisations,
    switchToPersonal,
    switchToOrganisation,
  } = useWorkspace();

  if (organisations.length === 0) return null;
  return (
    <div className="mb-3 flex gap-1.5 items-center">
      <button
        className={`px-2 py-0.5 rounded text-xs ${
          current.type === "personal"
            ? "bg-white/10 text-white"
            : "text-white/70 hover:bg-white/5"
        }`}
        onClick={switchToPersonal}
      >
        Personal
      </button>
      {organisations.map((org) => (
        <button
          key={org.id}
          className={`px-2 py-0.5 rounded text-xs ${
            current.type === "organisation" &&
            current.organisation?.id === org.id
              ? "bg-white/10 text-white"
              : "text-white/70 hover:bg-white/5"
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
  const { user } = useAuth();

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-[#111111] flex flex-col">
        <Header />
        <div className="flex flex-1 w-full mx-auto max-w-[1280px]">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-3 overflow-y-auto">
              <WorkspaceSwitcher />
              {children}
            </main>
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
}

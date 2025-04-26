
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type Organisation = {
  id: string;
  name: string;
  role?: string;
};

type WorkspaceType = "personal" | "organisation";
type Workspace = {
  type: WorkspaceType;
  organisation?: Organisation | null;
};

type WorkspaceContextType = {
  current: Workspace;
  organisations: Organisation[];
  switchToPersonal: () => void;
  switchToOrganisation: (org: Organisation) => void;
  refreshOrganisations: () => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [current, setCurrent] = useState<Workspace>({ type: "personal" });

  // Always fetch organisations list for the user
  const refreshOrganisations = async () => {
    if (user) {
      try {
        // Since we don't have the organisation_members table anymore, we'll just use an empty array
        console.log("User is logged in, but organisations table doesn't exist anymore");
        setOrganisations([]);
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
      }
    }
  };

  useEffect(() => {
    refreshOrganisations();
  }, [user]);

  // Auto-reset to personal on logout or no orgs
  useEffect(() => {
    if (!user) {
      setCurrent({ type: "personal" });
    }
  }, [user]);

  const switchToPersonal = () => setCurrent({ type: "personal" });
  const switchToOrganisation = (organisation: Organisation) =>
    setCurrent({ type: "organisation", organisation });

  return (
    <WorkspaceContext.Provider
      value={{
        current,
        organisations,
        switchToPersonal,
        switchToOrganisation,
        refreshOrganisations,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return context;
}

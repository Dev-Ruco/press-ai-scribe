
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        // Uso direto da consulta para evitar problemas com RLS
        const { data, error } = await supabase.rpc(
          'is_org_member', 
          { org_id: null } // Apenas para verificar se a função existe, não usamos o resultado
        ).then(async () => {
          // Se a função acima funcionar, podemos prosseguir
          return await supabase
            .from("organisation_members")
            .select("organisation_id, role, organisations(name)")
            .eq("user_id", user.id)
            .eq("status", "accepted");
        }).catch(async (err) => {
          console.error("Error checking RPC function:", err);
          // Fallback - consulta direta
          return await supabase
            .from("organisation_members")
            .select("organisation_id, role, organisations(name)")
            .eq("user_id", user.id)
            .eq("status", "accepted");
        });
        
        if (error) {
          console.error("Error fetching organizations:", error);
          return;
        }
        
        if (data) {
          setOrganisations(
            data.map((r: any) => ({
              id: r.organisation_id,
              name: r.organisations?.name ?? "Organização",
              role: r.role,
            }))
          );
        }
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

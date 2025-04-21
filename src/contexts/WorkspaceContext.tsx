
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

type Organisation = {
  id: string;
  name: string;
  role?: string;
  logoUrl?: string;
  primaryColor?: string;
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
  isAdmin: (orgId: string) => boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [current, setCurrent] = useState<Workspace>({ type: "personal" });

  // Always fetch organisations list for the user
  const refreshOrganisations = async () => {
    if (user) {
      try {
        // Get organizations with roles and styles
        const { data, error } = await supabase
          .from("organisation_members")
          .select(`
            organisation_id, 
            role, 
            organisations(
              name,
              organisation_styles(reference_docs)
            )
          `)
          .eq("user_id", user.id)
          .eq("status", "accepted");
        
        if (error) {
          console.error("Error fetching organizations:", error);
          return;
        }
        
        if (data) {
          setOrganisations(
            data.map((r: any) => {
              // Get style information if available
              const styles = r.organisations?.organisation_styles?.[0]?.reference_docs || {};
              
              return {
                id: r.organisation_id,
                name: r.organisations?.name ?? "Organização",
                role: r.role,
                logoUrl: styles.logo_url,
                primaryColor: styles.primary_color,
              };
            })
          );
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        toast({
          title: "Erro ao carregar redações",
          description: "Não foi possível carregar suas redações",
          variant: "destructive",
        });
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

  // Check if user is admin for a specific organization
  const isAdmin = (orgId: string) => {
    const org = organisations.find(org => org.id === orgId);
    return org?.role === 'admin';
  };

  // Auto persist workspace selection
  useEffect(() => {
    const savedWorkspace = localStorage.getItem('current-workspace');
    if (savedWorkspace) {
      try {
        const workspace = JSON.parse(savedWorkspace);
        if (workspace.type === 'personal') {
          setCurrent({ type: 'personal' });
        } else if (workspace.type === 'organisation' && workspace.organisation) {
          // Verify the organization still exists
          if (organisations.find(org => org.id === workspace.organisation.id)) {
            setCurrent(workspace);
          }
        }
      } catch (e) {
        console.error('Error parsing saved workspace', e);
      }
    }
  }, [organisations]);

  const switchToPersonal = () => {
    const newWorkspace = { type: "personal" as const };
    setCurrent(newWorkspace);
    localStorage.setItem('current-workspace', JSON.stringify(newWorkspace));
  };

  const switchToOrganisation = (organisation: Organisation) => {
    const newWorkspace = { type: "organisation" as const, organisation };
    setCurrent(newWorkspace);
    localStorage.setItem('current-workspace', JSON.stringify(newWorkspace));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        current,
        organisations,
        switchToPersonal,
        switchToOrganisation,
        refreshOrganisations,
        isAdmin,
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

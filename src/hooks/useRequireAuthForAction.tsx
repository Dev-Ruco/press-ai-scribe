
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";

export function useRequireAuthForAction() {
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);

  const gate = useCallback(
    (cb: () => void) => {
      if (!user) setPromptOpen(true);
      else cb();
    },
    [user]
  );

  return {
    gate,
    promptOpen,
    setPromptOpen
  };
}

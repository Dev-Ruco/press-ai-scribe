
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback, useEffect } from "react";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

export function useRequireAuthForAction() {
  const { user } = useAuth();
  const [promptOpen, setPromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    // If user becomes authenticated and there's a pending action, execute it
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  const gate = useCallback(
    (cb: () => void) => {
      if (!user) {
        setPendingAction(() => cb);
        setPromptOpen(true);
      } else {
        cb();
      }
    },
    [user]
  );

  return {
    gate,
    promptOpen,
    setPromptOpen,
    pendingAction
  };
}

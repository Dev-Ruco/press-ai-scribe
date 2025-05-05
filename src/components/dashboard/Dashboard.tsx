
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { motion } from "framer-motion";

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <motion.div 
      className="space-y-8 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top welcome section changes based on auth status */}
      <WelcomeSection />
      
      {/* Recent activity section with 3 cards */}
      <RecentActivitySection />
      
      {user && (
        <>
          {/* Stats visual section with charts */}
          <StatsSection />
        </>
      )}
    </motion.div>
  );
}

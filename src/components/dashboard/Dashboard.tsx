
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { QuickAccessSection } from "@/components/dashboard/QuickAccessSection";
import { RecentActivitySection } from "@/components/dashboard/RecentActivitySection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { FeatureAnnouncement } from "@/components/dashboard/FeatureAnnouncement";
import { ProductivityTip } from "@/components/dashboard/ProductivityTip";

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 py-6">
      {/* Top welcome section changes based on auth status */}
      <WelcomeSection />
      
      {/* Quick access cards */}
      <QuickAccessSection />
      
      {/* Recent activity section with 3 cards */}
      <RecentActivitySection />
      
      {user && (
        <>
          {/* Stats visual section with charts */}
          <StatsSection />
          
          {/* Additional helpful components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureAnnouncement />
            <ProductivityTip />
          </div>
        </>
      )}
    </div>
  );
}

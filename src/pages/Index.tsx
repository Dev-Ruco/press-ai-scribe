
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { OnboardingTutorial } from "@/components/dashboard/OnboardingTutorial";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ProductivityTip } from "@/components/dashboard/ProductivityTip";
import { RecentArticlesCard } from "@/components/dashboard/RecentArticlesCard";
import { RecentTranscriptionsCard } from "@/components/dashboard/RecentTranscriptionsCard";
import { RecentNewsSourcesCard } from "@/components/dashboard/RecentNewsSourcesCard";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { FeatureAnnouncement } from "@/components/dashboard/FeatureAnnouncement";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        {user ? (
          <>
            <StatsOverview />
            <QuickActions />
            <ProductivityTip />
            <FeatureAnnouncement />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RecentArticlesCard />
              <RecentTranscriptionsCard />
              <RecentNewsSourcesCard />
            </div>
            
            <ProgressBar />
          </>
        ) : (
          <>
            <OnboardingTutorial />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RecentArticlesCard />
              <RecentTranscriptionsCard />
              <RecentNewsSourcesCard />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;

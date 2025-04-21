
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { OnboardingTutorial } from "@/components/dashboard/OnboardingTutorial";
import { RecentArticlesCard } from "@/components/dashboard/RecentArticlesCard";
import { RecentTranscriptionsCard } from "@/components/dashboard/RecentTranscriptionsCard";
import { RecentNewsSourcesCard } from "@/components/dashboard/RecentNewsSourcesCard";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeCard />
        <OnboardingTutorial />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecentArticlesCard />
          <RecentTranscriptionsCard />
          <RecentNewsSourcesCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

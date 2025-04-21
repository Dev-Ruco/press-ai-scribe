
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { OnboardingTutorial } from "@/components/dashboard/OnboardingTutorial";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <WelcomeCard />
        <OnboardingTutorial />
        <QuickActions />
      </div>
    </MainLayout>
  );
};

export default Index;

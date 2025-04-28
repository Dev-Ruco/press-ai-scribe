
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeDashboard } from "@/components/dashboard/WelcomeDashboard";

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4">
        <WelcomeDashboard />
      </div>
    </MainLayout>
  );
}

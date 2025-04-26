import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeDashboard } from "@/components/dashboard/WelcomeDashboard";
export default function Index() {
  return <MainLayout>
      <div className="space-y-6">
        
        <WelcomeDashboard />
      </div>
    </MainLayout>;
}
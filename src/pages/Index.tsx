
import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeDashboard } from "@/components/dashboard/WelcomeDashboard";

export default function Index() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <WelcomeDashboard />
      </div>
    </MainLayout>
  );
}

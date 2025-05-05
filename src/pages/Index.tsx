
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4">
        <Dashboard />
      </div>
    </MainLayout>
  );
}

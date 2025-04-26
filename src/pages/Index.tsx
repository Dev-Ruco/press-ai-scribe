
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentArticlesCard } from "@/components/dashboard/RecentArticlesCard";
import { RecentNewsSourcesCard } from "@/components/dashboard/RecentNewsSourcesCard";
import { RecentTranscriptionsCard } from "@/components/dashboard/RecentTranscriptionsCard";

export default function Index() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentNewsSourcesCard />
          <RecentArticlesCard />
          <RecentTranscriptionsCard />
        </div>
      </div>
    </MainLayout>
  );
}

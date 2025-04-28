
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { RecentArticlesCard } from "@/components/dashboard/RecentArticlesCard";
import { RecentNewsSourcesCard } from "@/components/dashboard/RecentNewsSourcesCard";
import { RecentTranscriptionsCard } from "@/components/dashboard/RecentTranscriptionsCard";

export function WelcomeDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <WelcomeCard />
      
      {user && (
        <>
          <StatsOverview />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RecentNewsSourcesCard />
            <RecentArticlesCard />
            <RecentTranscriptionsCard />
          </div>
        </>
      )}
      
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{t('intelligentMonitoring')}</h3>
            </div>
            <p className="text-muted-foreground">
              {t('monitoringDescription')}
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{t('automaticTranscription')}</h3>
            </div>
            <p className="text-muted-foreground">
              {t('transcriptionDescription')}
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{t('acceleratedProduction')}</h3>
            </div>
            <p className="text-muted-foreground">
              {t('productionDescription')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

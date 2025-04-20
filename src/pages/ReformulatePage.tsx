
import { MainLayout } from "@/components/layout/MainLayout";
import { ReformulateEditor } from "@/components/reformulate/ReformulateEditor";
import { ReformulateAssistant } from "@/components/reformulate/ReformulateAssistant";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ReformulatePage() {
  return (
    <AuthGuard>
      <MainLayout>
        <div className="flex h-[calc(100vh-4rem)] gap-4 overflow-hidden p-4">
          <div className="flex-1 overflow-auto">
            <ReformulateEditor />
          </div>
          <div className="w-[400px] flex flex-col gap-4 overflow-hidden">
            <ReformulateAssistant />
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}

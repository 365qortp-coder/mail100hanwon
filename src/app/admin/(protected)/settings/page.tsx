import SettingsForm from "@/components/admin/SettingsForm";
import { getClinicSettings, isSupabaseConfigured } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getClinicSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">병원 정보</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          여기서 고친 값이 홈페이지 하단·지도·검색엔진용 정보에 함께 반영됩니다.
        </p>
      </div>
      <SettingsForm initial={settings} configured={isSupabaseConfigured()} />
    </div>
  );
}

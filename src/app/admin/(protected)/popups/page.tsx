import { PopupManager, type Popup } from "@/components/admin/PopupManager";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/adminData";

export const dynamic = "force-dynamic";

async function getPopups(): Promise<Popup[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("popups")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Popup[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminPopupsPage() {
  const popups = await getPopups();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">팝업 관리</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          홈페이지 첫 화면에 뜨는 안내창입니다. 기간이 지나면 자동으로 사라집니다.
        </p>
      </div>
      <PopupManager initial={popups} configured={isSupabaseConfigured()} />
    </div>
  );
}

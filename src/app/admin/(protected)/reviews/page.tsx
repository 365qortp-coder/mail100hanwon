import { ReviewManager, type Review } from "@/components/admin/ReviewManager";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/adminData";

export const dynamic = "force-dynamic";

async function getReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Review[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">후기 관리</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          후기 사진 한 장 + 코멘트 형식입니다. 의료법에 따라 <b>로그인한 회원에게만</b> 보입니다.
        </p>
      </div>
      <ReviewManager initial={reviews} configured={isSupabaseConfigured()} />
    </div>
  );
}

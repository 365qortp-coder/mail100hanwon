import { getAllColumnsIncludingDrafts } from "@/lib/columns";
import { getQueueStats, getUpcoming } from "@/lib/contentQueue";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  // 관리자 화면에서는 관리 앱이 배달해 둔 초안까지 보여야 한다
  const columns = getAllColumnsIncludingDrafts();
  const queueStats = getQueueStats();
  const upcoming = getUpcoming(6);
  return <AdminDashboard columns={columns} queueStats={queueStats} upcoming={upcoming} />;
}

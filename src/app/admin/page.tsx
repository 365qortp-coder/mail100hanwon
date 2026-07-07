import { getAllColumns } from "@/lib/columns";
import { getQueueStats, getUpcoming } from "@/lib/contentQueue";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const columns = getAllColumns();
  const queueStats = getQueueStats();
  const upcoming = getUpcoming(6);
  return <AdminDashboard columns={columns} queueStats={queueStats} upcoming={upcoming} />;
}

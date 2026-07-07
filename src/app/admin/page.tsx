import { getAllColumns } from "@/lib/columns";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const columns = getAllColumns();
  return <AdminDashboard columns={columns} />;
}

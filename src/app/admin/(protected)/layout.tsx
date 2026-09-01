import AdminNav from "@/components/admin/AdminNav";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}

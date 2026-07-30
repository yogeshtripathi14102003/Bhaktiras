import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Admin | Kishori Bhakti" };

// Server-side gate: the middleware already blocks unauthenticated /admin
// requests at the edge, but we check again here so this layout is safe
// on its own too (e.g. if middleware config ever changes).
export default function AdminLayout({ children }) {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-ivory">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}

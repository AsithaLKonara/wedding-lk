import { DashboardNavigation } from "@/components/organisms/dashboard-navigation";
import { DashboardHeader } from "@/components/organisms/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNavigation userRole="user" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
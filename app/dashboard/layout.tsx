import { UnifiedDashboardLayout } from "@/components/layouts/unified-dashboard-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedDashboardLayout>
      {children}
    </UnifiedDashboardLayout>
  );
}
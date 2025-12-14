import UnifiedDashboard from './unified-dashboard'
import { UnifiedDashboardLayout } from '@/components/layouts/unified-dashboard-layout'

export default function DashboardPage() {
  return (
    <UnifiedDashboardLayout>
      <UnifiedDashboard />
    </UnifiedDashboardLayout>
  )
}
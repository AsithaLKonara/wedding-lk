import { Metadata } from 'next';
import MonitoringDashboard from '@/components/monitoring/monitoring-dashboard';

export const metadata: Metadata = {
  title: 'Monitoring Dashboard | WeddingLK',
  description: 'Real-time platform health and performance monitoring',
};

export default function MonitoringPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MonitoringDashboard />
    </div>
  );
}

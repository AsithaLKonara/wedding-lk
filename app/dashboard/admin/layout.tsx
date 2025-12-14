import { AdminHeader } from '@/components/organisms/admin-header';
import { AdminNavigation } from '@/components/organisms/admin-navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminNavigation 
          userRole="admin"
          unreadNotifications={0}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
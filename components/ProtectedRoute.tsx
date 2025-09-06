"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2, ShieldX } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, requiredRole, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldX className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access this page</p>
        </div>
      </div>
    );
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldX className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page</p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole} | Your role: {session.user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Role-specific wrapper components
export function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}

export function VendorRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="vendor">{children}</ProtectedRoute>;
}

export function PlannerRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="wedding_planner">{children}</ProtectedRoute>;
}

export function UserRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>;
}

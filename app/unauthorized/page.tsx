"use client";

import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

function UnauthorizedPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const getDashboardUrl = () => {
    if (!user?.user?.role) return "/";
    
    switch (user.role) {
      case "admin":
        return "/dashboard/admin";
      case "vendor":
        return "/dashboard/vendor";
      case "wedding_planner":
        return "/dashboard/planner";
      case "user":
        return "/dashboard/user";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <ShieldX className="h-16 w-16 text-red-600 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This could be because:
        </p>
        
        <ul className="text-left text-sm text-gray-500 mb-8 space-y-2">
          <li>• You're not logged in</li>
          <li>• Your account doesn't have the required permissions</li>
          <li>• Your session has expired</li>
          <li>• You're trying to access a page meant for a different user type</li>
        </ul>

        {user ?.user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Your Role:</strong> {user.role}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              You can access your dashboard using the button below.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
          
          {user ?.user ? (
            <Link
              href={getDashboardUrl()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to My Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go to Login
            </Link>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(UnauthorizedPage), { ssr: false });

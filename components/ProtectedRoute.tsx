"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "USER";
}

export function ProtectedRoute({
  children,
  requiredRole = "USER",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login with callback URL
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // If role is required and user doesn't have it
    if (requiredRole === "ADMIN" && user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, router, pathname, requiredRole]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // If not authenticated or wrong role, don't render children
  if (!user || (requiredRole === "ADMIN" && user.role !== "ADMIN")) {
    return null;
  }

  return <>{children}</>;
}

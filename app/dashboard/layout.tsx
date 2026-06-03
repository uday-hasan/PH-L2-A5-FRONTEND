"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Mail,
  Star,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const BASE_NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  {
    href: "/dashboard/my-events",
    label: "My Events",
    icon: CalendarDays,
    exact: false,
  },
  {
    href: "/dashboard/invitations",
    label: "Invitations",
    icon: Mail,
    exact: false,
  },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star, exact: false },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    exact: false,
  },
];

const ADMIN_NAV = [
  { href: "/dashboard/admin", label: "Admin Panel", icon: Shield, exact: true },
];

function SidebarContent({
  user,
  pathname,
  onNavigate,
}: {
  user: { name: string; email: string; role: string; avatar?: string } | null;
  pathname: string;
  onNavigate?: () => void;
}) {
  const nav = user?.role === "ADMIN" ? [...BASE_NAV, ...ADMIN_NAV] : BASE_NAV;

  return (
    <div className="flex flex-col h-full">
      {user && (
        <div className="p-4 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatar} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          {user.role === "ADMIN" && (
            <span className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Admin
            </span>
          )}
        </div>
      )}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:text-white hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[#1e1e2e] bg-card sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent user={user} pathname={pathname} />
        </aside>

        {/* Mobile FAB */}
        <button
          className="lg:hidden fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-900/50"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[#1e1e2e] bg-card lg:hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#1e1e2e]">
                <span className="font-semibold text-white">Dashboard</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent
                user={user}
                pathname={pathname}
                onNavigate={() => setSidebarOpen(false)}
              />
            </aside>
          </>
        )}

        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

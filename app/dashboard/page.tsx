"use client";
import Link from "next/link";
import {
  CalendarDays,
  Mail,
  Star,
  PlusCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

const QUICK_LINKS = [
  {
    href: "/dashboard/my-events",
    icon: CalendarDays,
    label: "My Events",
    desc: "Create and manage your events",
  },
  {
    href: "/dashboard/invitations",
    icon: Mail,
    label: "Invitations",
    desc: "View pending invitations",
  },
  {
    href: "/dashboard/reviews",
    icon: Star,
    label: "My Reviews",
    desc: "Reviews you&apos;ve written",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-slate-400">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {user?.role === "ADMIN" && (
        <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
          <Shield className="h-5 w-5 text-violet-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Admin Account</p>
            <p className="text-xs text-slate-400">
              You have admin privileges to monitor all events and users.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <div className="h-full rounded-xl border border-[#1e1e2e] bg-card p-6 hover:border-violet-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/10 cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 shrink-0 group-hover:bg-violet-500/25 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-violet-500/30 bg-violet-600/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">Create a new event</p>
            <p className="text-sm text-slate-400 mt-0.5">
              Host public or private events and manage your attendees.
            </p>
          </div>
          <Link href="/dashboard/my-events">
            <Button size="md" className="shrink-0">
              <PlusCircle className="h-4 w-4" /> New Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#1e1e2e] bg-card px-5 py-4">
        <div>
          <p className="text-sm font-medium text-white">Discover events</p>
          <p className="text-xs text-slate-400">
            Browse upcoming public events
          </p>
        </div>
        <Link href="/events">
          <Button variant="outline" size="sm">
            Browse <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

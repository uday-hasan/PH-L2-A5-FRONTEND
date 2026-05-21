"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Calendar, LogOut, LayoutDashboard, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setDropdownOpen(false);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Planora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-white bg-[#1a1a2e]"
                    : "text-slate-400 hover:text-white hover:bg-[#1a1a2e]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 rounded-lg bg-[#1a1a2e] animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#1a1a2e] transition-colors"
                >
                  <Avatar name={user.name} src={user.avatar} size="sm" />
                  <span className="text-sm font-medium text-white max-w-[120px] truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#1e1e2e] bg-[#111118] py-1 shadow-xl z-20">
                      <div className="px-3 py-2 border-b border-[#1e1e2e]">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-[#1a1a2e] transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-[#1a1a2e] transition-colors">
                        <User className="h-4 w-4" /> Settings
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link href="/auth/register"><Button size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a2e] transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-[#1e1e2e] py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href ? "text-white bg-[#1a1a2e]" : "text-slate-400 hover:text-white hover:bg-[#1a1a2e]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#1e1e2e] space-y-2 px-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Button>
                  </Link>
                  <Button variant="destructive" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)}><Button variant="outline" size="sm" className="w-full">Login</Button></Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

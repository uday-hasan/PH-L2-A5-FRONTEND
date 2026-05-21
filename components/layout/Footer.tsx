import Link from "next/link";
import { Calendar, GitFork, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#111118] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-white mb-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Planora
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              A secure event management platform for creating, discovering, and
              participating in events.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[GitFork, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a2e] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/events", label: "Browse Events" },
                { href: "/auth/register", label: "Create Account" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-[#1e1e2e] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Planora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

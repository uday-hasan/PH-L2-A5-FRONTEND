import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { eventsApi } from "@/lib/events";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export async function HeroSection() {
  let featured = null;
  try { featured = await eventsApi.getFeatured(); } catch {}

  return (
    <section className="relative overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-violet-700/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Sparkles className="h-3 w-3" /> Event Management Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Create & Join{" "}
              <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                Amazing Events
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Discover public events, host private gatherings, and manage registrations — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/events" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-900/40">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-lg border border-[#1e1e2e] bg-transparent hover:bg-[#1a1a2e] px-6 py-3 text-sm font-semibold text-white transition-all">
                Get Started Free
              </Link>
            </div>
            <div className="flex gap-8 pt-4">
              {[{ value: "500+", label: "Events" }, { value: "10K+", label: "Users" }, { value: "50K+", label: "Registrations" }].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Featured or fallback */}
          {featured ? (
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-sm" />
              <div className="relative rounded-2xl border border-[#1e1e2e] bg-[#111118] p-6 space-y-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 border border-violet-500/30 px-2.5 py-0.5 text-xs font-medium text-violet-300">⭐ Featured Event</span>
                <h2 className="text-2xl font-bold text-white leading-tight">{featured.title}</h2>
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{featured.description}</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-violet-400" /><span>{formatDate(featured.date)} · {featured.time}</span></div>
                  {featured.venue && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-violet-400" /><span>{featured.venue}</span></div>}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm font-semibold text-white">{featured.registrationFee > 0 ? `৳${featured.registrationFee}` : "Free Entry"}</div>
                  <Link href={`/events/${featured.slug}`} className="inline-flex items-center gap-1 rounded-lg bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-medium text-white transition-all">
                    Join Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative hidden lg:block">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 blur-sm" />
              <div className="relative rounded-2xl border border-[#1e1e2e] bg-[#111118] p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Host Your Event</h3>
                <p className="text-sm text-slate-400">Create public or private events, set registration fees, and manage your attendees with ease.</p>
                <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition-all">
                  Start for Free <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
